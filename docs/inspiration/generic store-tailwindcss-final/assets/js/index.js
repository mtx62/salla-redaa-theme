/* main js */
(function ($) {
    "use strict";

    /* Loader */
    $(window).on("load", function () {
        $(".gs-loader").fadeOut("slow");
    });

    /* Aos animation on scroll */
    AOS.init({
        once: true,
    });

    /* Mobile menu sidebar JS */
    $(".gs-toggle-menu").on("click", function () {
        $(".gs-mobile-menu-overlay").fadeIn();
        $(".gs-mobile-menu").addClass("gs-menu-open");
    });

    $(".gs-mobile-menu-overlay, .gs-close-menu").on("click", function () {
        $(".gs-mobile-menu-overlay").fadeOut();
        $(".gs-mobile-menu").removeClass("gs-menu-open");
    });

    function ResponsiveMobilemsMenu() {
        var $msNav = $(".gs-menu-content, .overlay-menu"),
            $msNavSubMenu = $msNav.find(".sub-menu");
        $msNavSubMenu.parent().prepend('<span class="menu-toggle"></span>');

        $msNav.on("click", "li a, .menu-toggle", function (e) {
            var $this = $(this);
            if ($this.attr("href") === "#" || $this.hasClass("menu-toggle")) {
                e.preventDefault();
                if ($this.siblings("ul:visible").length) {
                    $this.parent("li").removeClass("active");
                    $this.siblings("ul").slideUp();
                    $this.parent("li").find("li").removeClass("active");
                    $this.parent("li").find("ul:visible").slideUp();
                } else {
                    $this.parent("li").addClass("active");
                    $this
                        .closest("li")
                        .siblings("li")
                        .removeClass("active")
                        .find("li")
                        .removeClass("active");
                    $this.closest("li").siblings("li").find("ul:visible").slideUp();
                    $this.siblings("ul").slideDown();
                }
            }
        });
    }

    ResponsiveMobilemsMenu();

    /* Custom select */
    $("select").each(function () {
        var $this = $(this),
            selectOptions = $(this).children("option").length;

        $this.addClass("hide-select");
        $this.wrap('<div class="select"></div>');
        $this.after('<div class="custom-select active"></div>');

        var $customSelect = $this.next("div.custom-select.active");
        $customSelect.text($this.children("option").eq(0).text());

        var $optionlist = $("<ul />", {
            class: "select-options",
        }).insertAfter($customSelect);

        for (var i = 0; i < selectOptions; i++) {
            $("<li />", {
                text: $this.children("option").eq(i).text(),
                rel: $this.children("option").eq(i).val(),
            }).appendTo($optionlist);
        }

        var $optionlistItems = $optionlist.children("li");

        $customSelect.click(function (e) {
            e.stopPropagation();
            $("div.custom-select.active")
                .not(this)
                .each(function () {
                    $(this).removeClass("active").next("ul.select-options").hide();
                });
            $(this).toggleClass("active").next("ul.select-options").slideToggle();
        });

        $optionlistItems.click(function (e) {
            e.stopPropagation();
            $customSelect.text($(this).text()).removeClass("active");
            $this.val($(this).attr("rel"));
            $optionlist.hide();
        });

        $(document).click(function () {
            $customSelect.removeClass("active");
            $optionlist.hide();
        });
    });

    /* Hero slider */
    var BryMainSlider = new Swiper(".hero-slider.swiper-container", {
        loop: true,
        centeredSlides: true,
        speed: 1000,
        parallax: true,
        autoplay: {
            delay: 5000,
        },
        autoplay: false,
        autoHeight: true,
        speed: 2500,
        pagination: {
            el: ".swiper-pagination",
            clickable: true,
        },
        navigation: {
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
        },
    });

    /* Deal slider section (Home Page) */
    $(".gs-deal-block").owlCarousel({
        loop: false,
        nav: true,
        smartSpeed: 500,
        autoplay: false,
        autoplayTimeout: 2500,
        items: 3,
        responsiveClass: true,
        responsive: {
            0: {
                items: 1,
            },
            481: {
                items: 2,
            },
            768: {
                items: 3,
            },
            1200: {
                items: 4,
            },
        },
    });

    /* Quick view modal slider*/
    $(".quickview-single-slide").owlCarousel({
        loop: false,
        nav: true,
        smartSpeed: 500,
        autoplay: false,
        autoplayTimeout: 2500,
        items: 1,
        responsiveClass: true,
    });

    /* Product slider (Latest & Related product section) */
    $(".gs-testimonials-block").owlCarousel({
        loop: true,
        dots: false,
        nav: false,
        smartSpeed: 500,
        autoplay: false,
        autoplayTimeout: 2500,
        items: 3,
        responsiveClass: true,
        responsive: {
            0: {
                items: 1,
            },
            768: {
                items: 2,
            },
            1200: {
                items: 3,
            }
        },
    });

    /* Single product Slider */
    $('.single-product-cover').slick({
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: false,
        fade: false,
        asNavFor: '.single-nav-thumb',
    });

    $('.single-nav-thumb').slick({
        slidesToShow: 4,
        slidesToScroll: 1,
        asNavFor: '.single-product-cover',
        dots: false,
        arrows: true,
        focusOnSelect: true
    });

    /* Qty Plus Minus Button  */
    var QtyPlusMinus = $(".qty-plus-minus");
    QtyPlusMinus.prepend('<div class="dec gs-qtybtn">-</div>');
    QtyPlusMinus.append('<div class="inc gs-qtybtn">+</div>');

    $("body").on("click", ".gs-qtybtn", function () {
        var $qtybutton = $(this);
        var QtyoldValue = $qtybutton.parent().find("input").val();
        if ($qtybutton.text() === "+") {
            var QtynewVal = parseFloat(QtyoldValue) + 1;
        } else {
            if (QtyoldValue > 1) {
                var QtynewVal = parseFloat(QtyoldValue) - 1;
            } else {
                QtynewVal = 1;
            }
        }
        $qtybutton.parent().find("input").val(QtynewVal);
    });

    /*-------------- tabs-ProductTab-Tailwindcss (product-page) -------------------*/
    $("#ProTab li:nth-child(1)").addClass("active");
    $(".tab-pro-pane").hide();
    $(".tab-pro-pane:nth-child(1)").show();
    $("#ProTab li").click(function () {
        $("#ProTab li").removeClass("active");
        $(this).addClass("active");
        $(".tab-pro-pane").hide();
        var activeTab = $(this).find("a").attr("href");
        $(activeTab).fadeIn();
        return false;
    });

    /*--------------------- Footer Toggle -------------------------------- */
    $(document).ready(function () {
        $(".gs-footer-links").addClass("gs-footer-dropdown");

        $('.gs-footer-heading').append("<div class='gs-heading-res'><i class='fi-rr-angle-small-down' aria-hidden='true'></i></div>");

        $(".gs-footer-heading .gs-heading-res").on("click", function () {
            var $this = $(this).closest('.footer-top .gs-footer-toggle').find('.gs-footer-dropdown');
            $this.slideToggle('slow');
            $('.gs-footer-dropdown').not($this).slideUp('slow');
        });
    });

    /* Cart sidebar JS */
    $(".gs-cart-toggle").on("click", function (e) {
        e.preventDefault();
        $(".gs-side-cart-overlay").fadeIn();
        $(".gs-side-cart").addClass("gs-open-cart");
    });
    $(".gs-side-cart-overlay, .gs-cart-close").on("click", function (e) {
        e.preventDefault();
        $(".gs-side-cart-overlay").fadeOut();
        $(".gs-side-cart").removeClass("gs-open-cart");
    });
    $(".cart-remove-item").on("click", function (e) {
        $(this).parents(".cart-sidebar-list").remove();
        var wish_product_count = $(".cart-sidebar-list").length;
        if (wish_product_count == 0) {
            $('.gs-cart-items').html('<p class="gs-wishlist-msg">Your Cart is empty!</p>');
        }
    });

    /* Category sidebar JS */
    $(".gs-category-toggle").on("click", function (e) {
        e.preventDefault();
        $(".gs-side-category-overlay").fadeIn();
        $(".gs-side-category").addClass("gs-open-category");
    });
    $(".gs-side-category-overlay, .gs-category-close").on("click", function (e) {
        e.preventDefault();
        $(".gs-side-category-overlay").fadeOut();
        $(".gs-side-category").removeClass("gs-open-category");
    });

    $(document).ready(function () {
        $(".category-sidebar-list").on("click", function (e) {
            var $this = $(this).find('.gs-sub-items');
            $this.slideToggle('slow');
            $('.gs-sub-items').not($this).slideUp('slow');
        });
    });

    /*----------- modal ----------------*/
    $(".gs-modal-toggle").on("click", function () {
        $(".gs-modal-overlay").fadeIn();
        $(".gs-modal").fadeIn();
        $("body").addClass("bb-overflow-hidden")
        $(".gs-modal-dialog").addClass("bb-fadeOutUp");
        $(".gs-modal-dialog").removeClass("bb-fadeInDown");
    });

    $(".gs-close-modal, .gs-modal-overlay").on("click", function () {
        $(".gs-modal-overlay").fadeOut();
        $(".gs-modal").fadeOut();
        $("body").removeClass("bb-overflow-hidden")
        $(".gs-modal-dialog").removeClass("bb-fadeOutUp");
        $(".gs-modal-dialog").addClass("bb-fadeInDown");
    });

})(jQuery);
