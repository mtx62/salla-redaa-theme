import { memo, useCallback, useEffect, useRef, useState, type RefObject } from 'react';
import { SallaSlider } from '@salla.sa/twilight-components-react/slider';
import { Link } from '@salla.sa/twilight-theme-engine/common';
import { parseSlideVideo, youtubeEmbedUrl } from '../../lib/slideVideo';
import { useMotionAllowed } from '../../hooks/useMotionAllowed';

export interface SliderBanner {
  link?: string;
  /** twilight.json `slides.url`: where the slide's button goes. */
  url?: string;
  image?: string;
  mobile_image?: string;
  video?: string;
  title?: string;
  subtitle?: string;
  description?: string;
  btnname?: string;
  show_button?: boolean;
  direction?: string[];
  title_color?: string;
  subtitle_color?: string;
  btnname_color?: string;
  without_overlay?: boolean;
}

export interface EnhancedSliderProps {
  data: {
    slider_banner?: SliderBanner[];
    slides?: SliderBanner[];
    slider_view_height?: number;
    slider_animation_time?: number;
    slider_aniamtion_time?: number;
    slider_animation_enabled?: boolean;
    /** twilight.json `auto_play`: move to the next slide on a timer. On unless switched off. */
    auto_play?: boolean;
    position?: number;
    in_container?: boolean;
    priority?: boolean;
    [key: string]: unknown;
  };
}

/**
 * Plays each slide video while it is on screen and pauses it otherwise, so only
 * the visible slide's video downloads and plays. Videos are found in the DOM, not
 * through refs, so the copies Swiper makes of slides for looping play too.
 */
export function useSlideVideos(root: RefObject<HTMLElement | null>, enabled: boolean) {
  useEffect(() => {
    const element = root.current;
    if (!element || !enabled) return;
    const playIf = (video: HTMLVideoElement, visible: boolean) => {
      if (!visible) return video.pause();
      video.muted = true; // autoplay needs it, and a copied slide only keeps attributes
      video.play().catch(() => undefined);
    };
    const observer =
      typeof IntersectionObserver === 'undefined'
        ? null
        : new IntersectionObserver(
            (entries) =>
              entries.forEach((entry) =>
                playIf(entry.target as HTMLVideoElement, entry.isIntersecting)
              ),
            // Slides off screen sit beside the visible one, clipped by the slider.
            { threshold: 0.5 }
          );
    const watched = new WeakSet<HTMLVideoElement>();
    const watch = () =>
      element.querySelectorAll<HTMLVideoElement>('video.enhanced-slider__video').forEach((video) => {
        if (watched.has(video)) return;
        watched.add(video);
        if (observer) observer.observe(video);
        else playIf(video, true);
      });
    watch();
    const mutations = new MutationObserver(watch);
    mutations.observe(element, { childList: true, subtree: true });
    return () => {
      mutations.disconnect();
      observer?.disconnect();
    };
  }, [root, enabled]);
}

/** How often, and how many times, the page asks a YouTube frame to start sending events. */
const YOUTUBE_LISTEN_INTERVAL_MS = 500;
const YOUTUBE_LISTEN_TRIES = 20;

/** YouTube's player state for "playing". */
const YOUTUBE_PLAYING = 1;

/**
 * A YouTube background, hidden until YouTube reports it is playing, so the slide
 * image shows while it loads, and removed if YouTube reports an error (embedding
 * disabled, video removed). Uses the embed's postMessage events (`enablejsapi`):
 * the page says it is listening, and the frame answers with its state.
 */
function YouTubeBackground({ id, onReady }: { id: string; onReady?: () => void }) {
  const ref = useRef<HTMLIFrameElement>(null);
  const [state, setState] = useState<'loading' | 'playing' | 'failed'>('loading');
  const visible = useRef(true);

  useEffect(() => {
    const frame = ref.current;
    if (!frame) return;
    let heard = false;
    let tries = 0;
    const onMessage = (event: MessageEvent) => {
      if (event.source !== frame.contentWindow) return;
      let data: { event?: string; info?: unknown } | null = null;
      try {
        data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
      } catch {
        return;
      }
      if (!data || typeof data !== 'object') return;
      heard = true;
      if (data.event === 'onError') return setState('failed');
      const playerState =
        data.event === 'onStateChange'
          ? data.info
          : (data.info as { playerState?: unknown } | null)?.playerState;
      if (playerState === YOUTUBE_PLAYING) {
        setState('playing');
        if (!visible.current) frame.contentWindow?.postMessage(JSON.stringify({ event: 'command', func: 'pauseVideo', args: [] }), 'https://www.youtube-nocookie.com');
      }
    };
    let timer: number | undefined;
    const send = () => {
      if (heard || tries >= YOUTUBE_LISTEN_TRIES) return window.clearInterval(timer);
      tries += 1;
      frame.contentWindow?.postMessage(
        JSON.stringify({ event: 'listening', id, channel: 'widget' }),
        'https://www.youtube-nocookie.com'
      );
    };
    // The frame is lazy, so it may load long after mounting: the tries start then.
    const listen = () => {
      window.clearInterval(timer);
      tries = 0;
      send();
      timer = window.setInterval(send, YOUTUBE_LISTEN_INTERVAL_MS);
    };
    window.addEventListener('message', onMessage);
    frame.addEventListener('load', listen);
    return () => {
      window.clearInterval(timer);
      window.removeEventListener('message', onMessage);
      frame.removeEventListener('load', listen);
    };
  }, [id]);

  useEffect(() => {
    const frame = ref.current;
    if (!frame || typeof IntersectionObserver === 'undefined') return;
    const observer = new IntersectionObserver(([entry]) => {
      visible.current = entry.isIntersecting;
      frame.contentWindow?.postMessage(JSON.stringify({ event: 'command', func: entry.isIntersecting ? 'playVideo' : 'pauseVideo', args: [] }), 'https://www.youtube-nocookie.com');
    }, { threshold: 0.1 });
    observer.observe(frame);
    return () => observer.disconnect();
  }, [id]);

  useEffect(() => {
    if (state === 'playing') onReady?.();
  }, [state, onReady]);

  if (state === 'failed') return null;
  return (
    <iframe
      ref={ref}
      className="enhanced-slider__video enhanced-slider__video--embed"
      data-state={state}
      src={youtubeEmbedUrl(id, window.location.origin)}
      title=""
      loading="lazy"
      allow="autoplay; encrypted-media"
      referrerPolicy="strict-origin-when-cross-origin"
      aria-hidden="true"
      tabIndex={-1}
    />
  );
}

/**
 * A slide's background video, over its image (which stays as the poster and the
 * fallback) and under its overlay. Rendered on the client only, and not for
 * visitors who ask for reduced motion. A video file waits for
 * {@link useSlideVideos} to play it; a YouTube embed loads lazily and plays
 * muted on its own.
 */
export function SlideVideo({ url, poster, onReady }: { url?: string; poster?: string; onReady?: () => void }) {
  const video = parseSlideVideo(url);
  if (!video) return null;
  if (video.kind === 'youtube') return <YouTubeBackground id={video.id} onReady={onReady} />;
  return (
    <video
      className="enhanced-slider__video"
      src={video.src}
      poster={poster}
      onPlaying={onReady}
      muted
      loop
      playsInline
      preload="none"
      disablePictureInPicture
      aria-hidden="true"
      tabIndex={-1}
    />
  );
}

function GenericHeroSlide({ slide, poster, priority, motionAllowed, onReady, index = 0 }: {
  slide: SliderBanner;
  poster?: boolean;
  priority?: boolean;
  motionAllowed?: boolean;
  index?: number;
  onReady?: () => void;
}) {
  const raw = slide as Record<string, unknown>;
  const fallbackHero = index % 2 === 1 ? '/images/hero/hero-2.png' : '/images/hero/hero-1.png';
  const heroImage = (slide.image || raw['slides.image'] || fallbackHero) as string;
  const mobileImage = (slide.mobile_image || raw['slides.mobile_image']) as string | undefined;
  const title = (slide.title ?? raw['slides.title'] ?? '') as string;
  const subtitle = (slide.subtitle ?? raw['slides.subtitle'] ?? '') as string;
  const description = (slide.description || raw['slides.description'] || '') as string;
  const btnname = (slide.btnname || raw['slides.btnname'] || '') as string;
  const linkUrl = (slide.url || raw['slides.url'] || slide.link || '') as string;
  const hasButton = slide.show_button !== false && Boolean(btnname.trim() && linkUrl);
  const videoUrl = slide.video || (raw['slides.video'] as string | undefined);
  const isVideo = Boolean(parseSlideVideo(videoUrl));
  const withoutOverlay = slide.without_overlay ?? raw['slides.without_overlay'];

  return (
    <div className={`store-hero${isVideo ? ' store-hero--video' : ' store-hero--image'}`}>
      {isVideo && (
        <div className="store-hero__background" aria-hidden="true">
          <picture>
            {mobileImage && <source media="(max-width: 639px)" srcSet={mobileImage} />}
            <img onLoad={poster ? undefined : onReady} src={heroImage} alt="" width={1920} height={1080} loading={priority ? 'eager' : 'lazy'} fetchPriority={priority ? 'high' : undefined} />
          </picture>
          {motionAllowed && !poster && <SlideVideo url={videoUrl} poster={heroImage} onReady={onReady} />}
        </div>
      )}
      {isVideo && <div className="store-hero__shade" aria-hidden="true" />}
      <div className="container store-hero__inner">
        <div className="store-hero__copy">
          {subtitle && <p className="store-hero__eyebrow" style={{ color: slide.subtitle_color }}>{subtitle}</p>}
          {title && <h2 style={{ color: slide.title_color }}>{title}</h2>}
          {description && <p className="store-hero__description">{description}</p>}
          {hasButton && (
            <Link
              to={linkUrl}
              className="home-slider__cta store-hero__cta"
              {...(poster && { tabIndex: -1 })}
            >
              {btnname}
              <span aria-hidden="true" className="store-hero__arrow">←</span>
            </Link>
          )}
        </div>
        {!isVideo && <div className="store-hero__visual">
          <div className="store-hero__media">
            <picture>
              {mobileImage && <source media="(max-width: 639px)" srcSet={mobileImage} />}
              <img
                onLoad={poster ? undefined : onReady}
                src={heroImage}
                alt={title}
                width={600}
                height={600}
                fetchPriority={priority ? 'high' : undefined}
                loading={priority ? 'eager' : 'lazy'}
                decoding="async"
              />
            </picture>
          </div>
        </div>}
      </div>

    </div>
  );
}

export const EnhancedSlider = memo(function EnhancedSlider({ data }: EnhancedSliderProps) {
  const rawSlides = data.slider_banner || data.slides || [];
  const slides = rawSlides;
  const position = data.position ?? 1;
  const hasMultipleSlides = slides.length > 1;
  const inContainer = Boolean(data.in_container);
  const firstImage = slides[0]?.image;
  // SSR copy of slide 1 over the slider until Swiper is up. SallaSlider renders only a
  // skeleton until hydration, so the hero image (the LCP) used to be requested late.
  const [showPoster, setShowPoster] = useState(
    Boolean(data.priority && firstImage && !inContainer)
  );
  const hidePoster = useCallback(() => {
    const image = new Image();
    image.src = firstImage ?? '';
    // Wait for the (already cached) image to decode so the swap never flashes.
    Promise.resolve(image.decode?.())
      .catch(() => undefined)
      .then(() => setShowPoster(false));
  }, [firstImage]);

  const root = useRef<HTMLDivElement>(null);
  const motionAllowed = useMotionAllowed();
  const hasVideo = motionAllowed && slides.some((slide) => parseSlideVideo(slide.video || slide['slides.video' as keyof SliderBanner]));
  useSlideVideos(root, hasVideo);

  if (!slides.length) return null;

  const first = slides[0];

  return (
    <div className="enhanced-slider" ref={root}>
      <SallaSlider
        id={`main-slider-${position}`}
        // Swiper's autoplay redraws every frame for its countdown, so a single slide skips it.
        autoPlay={hasMultipleSlides && motionAllowed && data.auto_play !== false}
        sliderConfig={{ lazy: false, watchOverflow: true }}
        showControls={hasMultipleSlides}
        pagination={hasMultipleSlides}
        type="fullwidth"
        className={inContainer ? 'in-container' : undefined}
        onAfterInit={showPoster ? hidePoster : undefined}
      >
        <div slot="items">
          {slides.map((slide, index) => (
            <div key={index} className="swiper-slide w-full relative">
              <GenericHeroSlide slide={slide} index={index} priority={Boolean(data.priority && index === 0)} motionAllowed={motionAllowed} onReady={index === 0 && showPoster ? hidePoster : undefined} />
            </div>
          ))}
        </div>
      </SallaSlider>

      {showPoster && (
        <div className="enhanced-slider__poster" aria-hidden="true">
          <GenericHeroSlide slide={first} poster priority />
        </div>
      )}
    </div>
  );
});
