/*Two Sided Multi Draggable Component that is used for dragging one or more apps between two lists in both directions*/
(function (jQuery) {
    (function () {
        var methods = {
			/**
			initialisation method which contains 
			the formation of UI related to lists, arrows
			click handling on li, arrows
			connection of list with each other with the help of jQuery Sortable
			sorting of available list apps
			Drag and Drop using sortable
			enable/disable of buttons
			**/
            init: function () {
                this.a = 'res';
                var inputObj = arguments[0];
                var availableApps = [];
                availableApps = inputObj.availableApps
                var selectedApps = [];
                selectedApps = inputObj.selectedApps;
                var moveOptions = inputObj.moveOptions;
                var max_sel = inputObj.maxSelected;
                var max_sel_enable = false;
                if (moveOptions == undefined) {
                    moveOptions = false;
                }
                if (max_sel == undefined) {
                    max_sel_enable = false;
                }
                else {
                    max_sel_enable = true;
                }
                var lastSelectedElePos;
                var lastSelectedEle;
                var htmlToAdd = "";
                var listLabelsHtml = '<div><span class="availableLabel">Available:</span><span class="selectedLabel">Selected:</span></div>';
                var availableListHtml = '<ul id="availableList"></ul>';
                var arrowBtnContainerHtml = '<div id="arrowBtnContainer"><input type="button" syle id="rightBtn" class="rightEle PrimaryActionButton" value="&rsaquo;"></input><input type="button" id="leftBtn" value="&lsaquo;" class="leftEle PrimaryActionButton"></input><input type="button" id="allRightBtn" value="&raquo;" class="rightEle PrimaryActionButton"></input><input type="button" id="allLeftBtn" value="&laquo;" class="leftEle PrimaryActionButton"></input></div>';
                var selectedListHtml = '<ul id="selectedList"></ul>';
                var upDownBtnContainerHtml = '';
                if (moveOptions) {
                    upDownBtnContainerHtml = '<div id="upDownBtnContainer"><input type="button" id="upBtn" value="&and;"></input><input type="button" id="downBtn" value="&or;"></input></div>';
                }
                htmlToAdd = listLabelsHtml + availableListHtml + arrowBtnContainerHtml + selectedListHtml + upDownBtnContainerHtml;
                $(this).append(htmlToAdd);
                var self = $(this);
                var availableList = $(this).find('#availableList');
                var selectedList = $(this).find('#selectedList');

                for (var i = 0; i < availableApps.length; i++) {
                    $(availableList).append($('<li>', {
                        id: availableApps[i].Id,
                        value: availableApps[i].Value,
                        text: availableApps[i].Value
                    }));
                }
                //sorting the available list apps
                methods.sortAvailableList();
                //fill the selected list apps
                for (var i = 0; i < selectedApps.length; i++) {
                    $(selectedList).append($('<li>', {
                        id: selectedApps[i].Id,
                        value: selectedApps[i].Value,
                        text: selectedApps[i].Value
                    }));
                }
                //sortable connection of both list to one another
                $(this).find("ul#availableList").sortable({
                    connectWith: selectedList,
                    cursor: 'move',
                    //containment: self,
                    dropOnEmpty: true
                });
                $(this).find("ul#availableList").disableSelection();

                $(this).find("ul#selectedList").sortable({
                    connectWith: availableList,
                    //containment: self,
                    cursor: 'move',
                    dropOnEmpty: true
                });
                $(this).find("ul#selectedList").disableSelection();

                methods.addSortable(self, availableList, max_sel, max_sel_enable);
                methods.addSortable(self, selectedList, max_sel, max_sel_enable);

                $(this).find('#rightBtn, #leftBtn, #upBtn, #downBtn').attr('disabled', true);

                $(this).find('li').click(function (event) {
                    if (($(this).parent().has(lastSelectedEle).length > 0) && $('.ui-selected').length >= 1 && event.shiftKey) {
                        var currentSelectedElePos = $(this).index();
                        var currentSelectedEle = $(this);
                        var currentSelectedHasClass = $(currentSelectedEle).hasClass('ui-selected');
                        $.each($(event.currentTarget.parentNode).children(), function () {
                            if (currentSelectedHasClass) {
                                if (currentSelectedElePos < lastSelectedElePos) {
                                    if ($(this).index() > currentSelectedElePos && $(this).index() <= lastSelectedElePos)
                                        $(this).removeClass('ui-selected');
                                }
                                else if (currentSelectedElePos >= lastSelectedElePos) {
                                    if ($(this).index() < currentSelectedElePos && $(this).index() >= lastSelectedElePos)
                                        $(this).removeClass('ui-selected');
                                }
                            }
                            else {
                                if ((currentSelectedElePos <= $(this).index() && $(this).index() <= lastSelectedElePos) || (currentSelectedElePos >= $(this).index() && $(this).index() >= lastSelectedElePos))
                                    $(this).addClass('ui-selected');
                            }
                        });
                    }
                    else if ($('.ui-selected').length >= 1 && !event.ctrlKey) {
                        $('.ui-selected').removeClass('ui-selected');
                        $(this).addClass('ui-selected');
                    }
                    else {
                        $(this).toggleClass("ui-selected");
                    }
                    var id = $(this).parent().attr('id');
                    if (id == "availableList") {
                        $(selectedList).children().removeClass('ui-selected');
                        if ($('.ui-selected').length >= 1) {
                            methods.updateArrows(self, true, false, false, false);
                        }
                        else {
                            methods.updateArrows(self, true, true, false, false);
                        }
                        if ($(selectedList).children().length <= 0) {
                            methods.updateArrows(self, true, false, false, true);
                        }
                        if (moveOptions) {
                            $(self).find('#upBtn').attr("disabled", true);
                            $(self).find('#downBtn').attr("disabled", true);
                        }
                    }
                    else if (id == "selectedList") {
                        $(availableList).children().removeClass('ui-selected');
                        if ($('.ui-selected').length >= 1) {
                            methods.updateArrows(self, false, true, false, false);
                        }
                        else {
                            methods.updateArrows(self, true, true, false, false);
                        }
                        if ($(availableList).children().length <= 0) {
                            methods.updateArrows(self, false, true, true, false);
                            $(self).find('#upBtn').attr("disabled", true);
                            $(self).find('#downBtn').attr("disabled", true);
                        }
                        if (moveOptions) {
                            if ($('.ui-selected').length > 1) {
                                methods.updateUpDownArrows(selectedApps, $('.ui-selected').first(), $(self), $('.ui-selected').last());
                            }
                            else if ($('.ui-selected').length <= 0) {
                                $(self).find('#upBtn').attr("disabled", true);
                                $(self).find('#downBtn').attr("disabled", true);
                            }
                            else {
                                methods.updateUpDownArrows(selectedApps, $(this), $(self));
                            }
                        }
                    }
                    lastSelectedEle = $(this);
                    lastSelectedElePos = $(this).index();
                });

                $(this).find('#arrowBtnContainer input').click(function (event) {
                    var first_rows;
                    var elementToAppend;
                    var selContainer;
                    var sortNeeded = false;
                    var currTarget = event.currentTarget.id;
                    var currTargetClass = event.currentTarget.className;
                    if (currTargetClass == "leftEle PrimaryActionButton") {
                        var ele_id = $(availableList).attr('id');
                        elementToAppend = $(self).find('#' + ele_id);
                        selContainer = $(selectedList);
                        sortNeeded = true;
                    }
                    else {
                        var ele_id = $(selectedList).attr('id');
                        elementToAppend = $(self).find('#' + ele_id);
                        selContainer = $(availableList);
                    }
                    if (currTarget == "allRightBtn") {
                        $(availableList).children().addClass('ui-selected');
                        methods.updateArrows(self, true, true, true, false);
                    }
                    else if (currTarget == "allLeftBtn") {
                        sortNeeded = true;
                        $(selectedList).children().addClass('ui-selected');
                        methods.updateArrows(self, true, true, false, true);
                    }
                    if (currTarget == "rightBtn") {
                        methods.updateArrows(self, true, true, false, false);
                    }
                    else if (currTarget == "leftBtn") {
                        methods.updateArrows(self, true, true, false, false);
                    }
                    if ($(self).find(selContainer).children().hasClass('ui-selected') && $(self).find('.ui-selected').length > 0) {
                        first_rows = $(self).find('.ui-selected').map(function (i, e) {
                            var $li = $(e);
                            return {
                                li: $li.clone(true),
                                id: $li.attr('id')
                            };
                        }).get();
                        $(self).find('.ui-selected').addClass('cloned');
                        if (!max_sel_enable) {
                            if (first_rows.length > 0) {
                                $.each(first_rows, function (i, item) {
                                    $(item.li).removeAttr('style').appendTo(elementToAppend);
                                });
                            }
                        }
                        else {
                            methods.sortMaxUponArrow(first_rows, elementToAppend, max_sel, $(self));
                        }
                        $(self).find('.cloned').remove();
                        first_rows = {};
                    }
                    $("li").removeClass('ui-selected');

                    if (sortNeeded) {
                        methods.sortAvailableList();
                        sortNeeded = false;
                    }
                    if (moveOptions) {
                        $(self).find('#upBtn').attr("disabled", true);
                        $(self).find('#downBtn').attr("disabled", true);
                    }
                });

                if (moveOptions) {
                    $(this).find('#upDownBtnContainer input').click(function (event) {
                        var currTargetId = event.currentTarget.id;
                        var len = $(self).find('#selectedList li').length;
                        var size = 11;
                        $(self).find('#selectedList li').each(function (i, e) {
                            if ($(e).hasClass('ui-selected') && $(e)[0] == $('.ui-selected')[0]) {
                                if (currTargetId == 'upBtn' && i > 0) {
                                    var prevEle = $('.ui-selected').first().prev();
                                    $('.ui-selected').insertBefore($(prevEle));
                                    var sel_index = $('#selectedList li').index($('.ui-selected').first());
                                    if (sel_index <= (len - size + 1) && $(self).find('#selectedList').scrollTop() != 0) {
                                        $(self).find('#selectedList').scrollTop($(e).offset().top - $(self).find('#selectedList').offset().top + $(self).find('#selectedList').scrollTop());
                                    }
                                    if ($('.ui-selected').length > 1) {
                                        methods.updateUpDownArrows(selectedApps, $('.ui-selected').first(), $(self), $('.ui-selected').last());
                                    }
                                    else {
                                        methods.updateUpDownArrows(selectedApps, $(this), $(self));
                                    }

                                }
                                else if (currTargetId == 'downBtn' && i < len - 1) {
                                    var sel_index = $('#selectedList li').index($('.ui-selected').last());
                                    var nextEle = $('.ui-selected').last().next();
                                    $('.ui-selected').insertAfter($(nextEle));
                                    //if (sel_index >= (size - 1) || (sel_index >= (size - 1) || $(self).find('#selectedList').scrollTop() != 0)) {
                                    if (sel_index + 1 >= (size - 2)) {
                                        $(self).find('#selectedList').scrollTop($(e).offset().top - $(self).find('#selectedList').offset().top + $(self).find('#selectedList').scrollTop());
                                    }
                                    if ($('.ui-selected').length > 1) {
                                        methods.updateUpDownArrows(selectedApps, $('.ui-selected').first(), $(self), $('.ui-selected').last());
                                    }
                                    else {
                                        methods.updateUpDownArrows(selectedApps, $(this), $(self));
                                    }
                                }
                            }
                        });
                        methods.updateArrows(self, false, true, false, false);
                    });
                }
            },
            sortMaxUponArrow: function (first_rows_a, elementToAppend, max_sel, self) {
                var sel_li = elementToAppend[0].children.length;
                if (sel_li < max_sel) {
                    var cnt = max_sel - sel_li;
                    if (first_rows_a.length + sel_li < max_sel) {
                        $.each(first_rows_a, function (i, item) {
                            $(item.li).removeAttr('style').appendTo(elementToAppend);
                        });
                    }
                    else {
                        var appendBack = first_rows_a.splice(cnt, first_rows_a.length);
                        $.each(first_rows_a, function (i, item) {
                            $(item.li).removeAttr('style').appendTo(elementToAppend);
                        });
                        $.each(appendBack, function (i, item) {
                            $(item.li).removeAttr('style');
                            var ele_id = $(availableList).attr('id');
                            var ele_appd = $(self).find('#' + ele_id);
                            $(ele_appd).append(item.li);
                        });
                        methods.sortAvailableList();
                    }
                }
                else if (sel_li >= max_sel) {
                    $.each(first_rows_a, function (i, item) {
                        $(item.li).removeAttr('style');
                        var ele_id = $(availableList).attr('id');
                        var ele_appd = $(self).find('#' + ele_id);
                        $(ele_appd).append(item.li);
                    });
                    methods.sortAvailableList();
                }
            },
            sortAvailableList: function () {
                var arr = [];
                // loop through each list item and get the complete item
                $('ul#availableList li').each(function () {
                    var meta = $(this)[0];
                    meta.elem = $(this);
                    arr.push(meta);
                });
                arr.sort(function compare(a, b) {
                    return (a.textContent < b.textContent) ? -1 : (a.textContent > b.textContent) ? 1 : 0;
                });
                //Foreach item append it to the container.
                $.each(arr, function (index, item) {
                    item.elem.appendTo(item.elem.parent());
                });
            },
            addSortable: function (self, ele1, max_sel, max_sel_enable) {
                var first_rows_a = {};
                var nextSibling;

                $(ele1).on('sortstart', function (event1, ui) {
                    nextSibling = $(ui.item[0].nextSibling);
                    if (ui.item.hasClass('ui-selected') && $('.ui-selected').length > 1) {
                        first_rows_a = $('.ui-selected').map(function (i, e) {
                            var $li = $(e);
                            return {
                                li: $li.clone(true),
                                id: $li.attr('id')
                            };
                        }).get();
                        $('.ui-selected').addClass('cloned');
                    }
                });

                $(ele1).on('sort', function (event1, ui) {
                    var $helper = $('.ui-sortable-helper');
					$helper.removeAttr('style');
                });
                $(ele1).on('sortstop', function (event1, ui) {
                    var sel_li = $(this)[0].parentNode.children[3].children.length;
                    if (max_sel_enable && $(ui.item[0].parentElement) != $(availableList)) {
                        if (sel_li <= max_sel) {
                            var cnt = first_rows_a.length + sel_li - max_sel;
                            var toRemove = first_rows_a.length - (cnt - 1);  //1- since default sort
                            if (cnt == 0) {
                                if (first_rows_a.length > 1) {
                                    $.each(first_rows_a, function (i, item) {
                                        $(item.li).removeAttr('style').insertBefore(ui.item);
                                    });
                                }
                            }
                            else {
                                if (first_rows_a.length > 1) {
                                    var appendBack = first_rows_a.splice(toRemove, first_rows_a.length);
                                    $.each(first_rows_a, function (i, item) {
                                        $(item.li).removeAttr('style').insertBefore(ui.item);
                                    });
                                    $.each(appendBack, function (i, item) {
                                        $(item.li).removeAttr('style');
                                        $(availableList).append(item.li);
                                    });
                                    methods.sortAvailableList();
                                }
                            }
                        }
                        else if (sel_li >= max_sel) {
                            if (event1.currentTarget.id != "selectedList") {
                                $(ui.item[0]).insertBefore($(nextSibling));
                            }
                            if (first_rows_a.length > 1) {
                                $.each(first_rows_a, function (i, item) {
                                    if (ui.item[0] != item.li) {
                                        $(item.li).removeAttr('style');
                                        $(availableList).append(item.li);
                                    }
                                });
                            }
                            methods.sortAvailableList();
                        }
                    }
                    else if (!max_sel_enable) {
                        if (first_rows_a.length > 1) {
                            $.each(first_rows_a, function (i, item) {
                                $(item.li).removeAttr('style').insertBefore(ui.item);
                            });
                        }
                    }

                    $('.cloned').remove();
                    first_rows_a = {};
                    if ($(ui.item[0].parentElement) != this) {
                        $(self).find('#allLeftBtn').attr('disabled', false);
                        $(self).find('#allRightBtn').attr('disabled', false);
                    }
                    methods.sortAvailableList();
                    $("li").removeClass('ui-selected');
                    methods.updateArrows($(self), true, true, false, false);

                    $('li.ui-sortable-placeholder').each(function () {
                        this.parentNode.removeChild(this);
                    });
                });
            },
            updateUpDownArrows: function (selectedApps, firstEle, self, lastEle) {
                var last,
                    isLast,
                    first,
                    isFirst;

                if (lastEle != undefined) {
                    last = $(self).find('#selectedList li:last');
                    isLast = $(lastEle)[0].id == last[0].id;
                }
                else {
                    last = $(self).find('#selectedList li:last');
                    isLast = $(firstEle)[0].id == last[0].id;
                }
                first = $(self).find('#selectedList li:first');
                isFirst = $(firstEle)[0].id == first[0].id;
                if (isFirst) {
                    $(self).find('#upBtn').attr("disabled", true);
                }
                else {
                    $(self).find('#upBtn').attr("disabled", false);
                }
                if (isLast) {
                    $(self).find('#downBtn').attr("disabled", true);
                }
                else {
                    $(self).find('#downBtn').attr("disabled", false);
                }
            },
            updateArrows: function (self, left, right, allRight, allLeft) {
                $(self).find('#leftBtn').attr("disabled", left);
                $(self).find('#allLeftBtn').attr("disabled", allLeft);
                $(self).find('#rightBtn').attr("disabled", right);
                $(self).find('#allRightBtn').attr("disabled", allRight); ;
            }
        };
        $.fn.multiDraggableComponent = function () {
            methods.init.apply(this, arguments)
        }
    })();
})();