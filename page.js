(function ($){
        "use strict";
        function Pagination(element,options){
            if(typeof options.totalPage!='number'||options.totalPage == 0)
                return ;
            this.currentPageIndex = 1;
            this.totalPageCount = options.totalPage;
            this.$container = $(element);
            $(element).empty();
            this.previousPage = 1;
            this.options = options;
            if(options.maxShowItem>=3){
            	this.options.maxShowItem = options.maxShowItem||options.totalPage;
            }else{
            	this.options.maxShowItem = options.totalPage;
            }
            this.initPagePanel(options);
            var pageChangeEvent = $.Event('pageChange',{currentPage:self.currentPageIndex});
            $(element).trigger(pageChangeEvent);
        }
        Pagination.prototype = {
            constructor: Pagination,
            prevPage: function() {
                var self = this;
                if(self.currentPageIndex == 1){
                    return self.currentPageIndex;
                }
                self.previousPage = self.currentPageIndex;
                self.currentPageIndex--;
                $.proxy(this,'refreshPagePanel')();
            },
            nextPage: function() {
                var self = this;
                if(self.currentPageIndex == self.totalPageCount){
                    return self.totalPageCount;
                }
                self.previousPage = self.currentPageIndex;
                self.currentPageIndex++;
                $.proxy(this,'refreshPagePanel')();
            },
            refreshPagePanel: function() {
                var self = this;
                if(self.currentPageIndex == self.totalPageCount){
                    self.$container.find(".Next").addClass("disabled");
                    self.$container.find(".Prev").removeClass("disabled");
                }else if(self.currentPageIndex == 1){
                    self.$container.find(".Prev").addClass("disabled");
                    self.$container.find(".Next").removeClass("disabled");
                }else{
                    self.$container.find(".Next").removeClass("disabled");
                    self.$container.find(".Prev").removeClass("disabled");
                }
                $.proxy(this,'_draw')();
                var pageChangeEvent = $.Event('pageChange',{currentPage:self.currentPageIndex});
                self.$container.trigger(pageChangeEvent);
            },
            _draw:function(){
            	var self = this;
            	if(self.totalPageCount == 1){
            		return ;
            	}
            	self.$container.find('li').not('.Next,.Prev').remove();
            	var itemLeave = self.options.maxShowItem-3;
            	var $currentItem = self.$container.find(".Prev");
            	if(self.currentPageIndex == 1||self.currentPageIndex == self.totalPageCount){
                    itemLeave++;
                }
            	var flag = false;
            	for(var currentDisplay=1;currentDisplay<=self.totalPageCount;currentDisplay++){
            		if(currentDisplay !=1 && currentDisplay !=(self.currentPageIndex)&&currentDisplay!=self.totalPageCount){
                    	itemLeave --;
                    }
                    if(itemLeave>=0||currentDisplay == (self.currentPageIndex) ||currentDisplay == self.totalPageCount){
                    	var eleStr = '<li class="pageNum"><a href="#">'+currentDisplay+'</a></li>';
	                    var $tempElem=$(eleStr);
	                    $tempElem.data('index',currentDisplay);
	                    $currentItem.after($tempElem);
	                    $currentItem = $tempElem;
	                    if(currentDisplay == (self.currentPageIndex)){
	                    	$tempElem.addClass('active');
	                    	flag = false;
	                    }
                    }else if(!flag){
                    	var eleStr = '<li class="eclip"><a href="#">'+'...'+'</a></li>';
	                    var $tempElem=$(eleStr);
	  					$tempElem.addClass('disabled');
	                    $currentItem.after($tempElem);
	                    $currentItem = $tempElem;
	                    flag = true;
                    }
	            	
                    
            	}
            },
            gotoThePage: function(pageIndex) {
                var self = this;
                if(self.$container){
                    self.previousPage = self.currentPageIndex;
                    self.currentPageIndex = pageIndex;
                    self.$container.find(".pagination .pageNum").eq((self.previousPage-1)).removeClass("active");
                    self.$container.find(".pagination .pageNum").eq((self.currentPageIndex-1)).addClass("active");

                    $.proxy(this,'refreshPagePanel')();
                }
            },
            initPagePanel: function(options) {
                var self = this;
                self.$container.append($('<nav><ul class="pagination"></ul></nav>'));
                if(options.totalPage==1){
                    var tempElem = $('<li class="pageNum"><a href="#">1</a></li>');
                    tempElem.data('index',1);
                    self.$container.find(".pagination").append(tempElem);
                }else{
                    self.$prev=$('<li class="Prev"><a href="#" aria-label="Previous"><span aria-hidden="true">&laquo;</span></a></li>');
                    self.$container.find(".pagination").append(self.$prev);
                    // for(var i=1;i<=options.totalPage;i++){
                    //     var eleStr = '<li class="pageNum"><a href="#">'+i+'</a></li>';
                    //     var tempElem=$(eleStr);
                    //     tempElem.data('index',i);
                    //     self.$container.find(".pagination").append(tempElem);
                    // }
                    self.$next = $('<li class="Next"><a href="#" aria-label="Previous"><span aria-hidden="true">&raquo;</span></a></li>');
                    self.$container.find(".pagination").append(self.$next);
                }
                if(self.$prev&&self.$next){
                    self.$prev.on('click',$.proxy(function(event) {
                        self.prevPage();
                    },self));
                    self.$next.on('click',$.proxy(function(event) {
                        self.nextPage();
                    },self));
                }
                self.$container.on('click','.pageNum',function(event){
                    self.gotoThePage($(event.currentTarget).data('index'));
                });
                $.proxy(this,'refreshPagePanel')();
            },
            destroy:function(){
                var self = this;
                if(self.$container){
                    self.$container.removeData('pagination');
                    self.$container.empty();
                }
            }
        };
        $.fn.pagination1 = function(arg1,arg2){
            var results = [];
            this.each(function() {
                var pagination = $(this).data('pagination');
                if(arg1==='destroy'){
                    if(pagination){
                        var retVal = pagination[arg1](arg2);
                        if (retVal !== undefined)
                            results.push(retVal);
                    }else{
                        return true;
                    }
                }else if(!pagination){
                    pagination = new Pagination(this,arg1);
                    $(this).data('pagination',pagination);
                    results.push(pagination);
                }else  if(pagination[arg1] !== undefined) {
                    var retVal = pagination[arg1](arg2);
                    if (retVal !== undefined)
                        results.push(retVal);
                }

            });
            return results;
        }
        //LET OTHER ADD MOTHOD TO THE PLUGIN
        $.fn.pagination1.Constructor = Pagination;
    })(window.jQuery)