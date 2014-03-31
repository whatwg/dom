
// stolen from http://css-tricks.com/persistent-headers/
(function ($) {
    function updateTH () {
        $(".persist-area").each(function() {
            var $el = $(this)
            ,   offset = $el.offset()
            ,   scrollTop = $(window).scrollTop()
            ,   $floatingHeader = $(".floatingHeader", this)
            ;
            if ((scrollTop > offset.top) && (scrollTop < offset.top + $el.height()))
                $floatingHeader.css({ "visibility": "visible" });
            else
               $floatingHeader.css({ "visibility": "hidden" });
        });
    }
    $(function() {
        var $clonedHeaderRow;
        $(".persist-area").each(function() {
            $clonedHeaderRow = $(".persist-header", this);
            var widths = [];
            $clonedHeaderRow.find("td, th").each(function () {
                widths.push($(this).outerWidth());
            });
            $clonedHeaderRow
                .before($clonedHeaderRow.clone())
                .css("width", $clonedHeaderRow.width())
                .addClass("floatingHeader");
            $clonedHeaderRow.find("td, th").each(function () {
                $(this).css("width", widths.shift());
            });
        });
        $(window)
            .scroll(updateTH)
            .trigger("scroll");
    });
}(jQuery));
