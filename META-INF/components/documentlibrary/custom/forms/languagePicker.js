function OnSelectionChange (select) {
	    var parts,
                nodeRef,
		Dom = YAHOO.util.Dom,
		oldSelectedLanguages,
		oldLanguagesSplitted,
      		nodRef;
            //alert ("The selected option is " + select.value);
	    //alert ("The control id is " + select.id);  
            parts = select.id.split("|");
	    //alert ("parts[0] " + parts[0]);
	    //alert ("parts[1] " + parts[1]);
            ctrlId = parts[0];
	    oldSelectedLanguages = Dom.get(ctrlId + "-lang").value;
            //alert ("oldSelectedLanguages " + oldSelectedLanguages);
	    nodeRef = select.name;
            //alert ("nodeRef " + nodeRef);
	    //split oldLanguages wit ,
            oldLanguagesSplitted = oldSelectedLanguages.split(",");
	    newSelectedLanguages = "";
            for (var i = 0; i < oldLanguagesSplitted.length ; i++)
            {
		if (oldLanguagesSplitted[i].indexOf(nodeRef) == 0)
		{
		  //alert ("Old language for node = " + oldLanguagesSplitted[i]);
		  oldLanguagesSplitted[i] = nodeRef + "." + select.value;
                  //alert ("New language for node = " + oldLanguagesSplitted[i]);
		}
            }
	    Dom.get(ctrlId + "-lang").value = oldLanguagesSplitted.toString();	    	    	
}  

 (function()
   {
   
      /**
       * YUI Library aliases
       */
      var Dom = YAHOO.util.Dom,
      Event = YAHOO.util.Event,
      KeyListener = YAHOO.util.KeyListener;

     /**
      * Alfresco Slingshot aliases
      */
      var $html = Alfresco.util.encodeHTML,
      $hasEventInterest = Alfresco.util.hasEventInterest,
      $combine = Alfresco.util.combinePaths;
   
            Alfresco.LanguageObjectFinder = function(controlId,fieldHtmlId) {
            // usually extending Alfresco.component.Base or something.
            // here, you also often declare array of YUI components you'll need,
            // like button, datatable etc
            Alfresco.LanguageObjectFinder.superclass.constructor.call(this,controlId,fieldHtmlId);
            // and some extra init code, like binding a custom event from anotehr component
            //YAHOO.Bubbling.on('someEvent', this.someMethod, this);
            }
            
          // then in the end, there is the extending of Alfresco.component.Base
          // which has basic Alfresco methods, like setOptions(), msg() etc
          // and adding new params and scripts to it. 
          YAHOO.extend(Alfresco.LanguageObjectFinder, Alfresco.ObjectFinder,
           // extending object holding variables and methods of the new class,
           // setting defaults etc
            {
              /**
               * Returns currently selected languages
               *
               * @method getSelectedItems
               * @return {array}
               */
               getSelectedLanguages: function ObjectFinder_getSelectedLanguages()
               {
                 var selectedLanguage = [],work = "";
        
                 for (var item in this.selectedItems)
                 {
                    if (this.selectedItems.hasOwnProperty(item))
                    {
		       work = this.selectedItems[item].nodeRef + "." + this.selectedItems[item].language;
		       selectedLanguage.push(work);

                    }
                 }
                 return selectedLanguage;
               },
              /* Adjust the current values, added, removed input elements according to the new selections
               * and fires event to notify form listeners about the changes.
               *
               * @method _adjustCurrentValues
               */
              _adjustCurrentValues: function ObjectFinder__adjustCurrentValues()
              {
                 if (!this.options.disabled)
                 {
                    var addedItems = this.getAddedItems(),
                       removedItems = this.getRemovedItems(),
                       selectedItems = this.getSelectedItems()
                       selectedLanguages = this.getSelectedLanguages();
        
                    if (this.options.maintainAddedRemovedItems)
                    {
                       Dom.get(this.id + "-added").value = addedItems.toString();
                       Dom.get(this.id + "-removed").value = removedItems.toString();
                       Dom.get(this.id + "-lang").value = selectedLanguages.toString();
                    }
                    Dom.get(this.currentValueHtmlId).value = selectedItems.toString();
                    if (Alfresco.logger.isDebugEnabled())
                    {
                       Alfresco.logger.debug("Hidden field '" + this.currentValueHtmlId + "' updated to '" + selectedItems.toString() + "'");
                    }
                                         
                    // inform the forms runtime that the control value has been updated (if field is mandatory)
                    if (this.options.mandatory)
                    {
                       YAHOO.Bubbling.fire("mandatoryControlValueUpdated", this);
                    }
        
                    YAHOO.Bubbling.fire("formValueChanged",
                    {
                       eventGroup: this,
                       addedItems: addedItems,
                       removedItems: removedItems,
                       selectedItems: selectedItems,
                       selectedItemsMetaData: Alfresco.util.deepCopy(this.selectedItems)
                    });
        
                    this._enableActions();
                 }
              },      
	      /**
	       * Gets selected or current value's metadata from the repository
	       *
	       * @method _loadSelectedItems
	       * @private
	       */
	      _loadSelectedItems: function ObjectFinder__loadSelectedItems(useOptions)
	      {
		 var arrItems2 = "";
		 if (this.options.selectedValue)
		 {
		    arrItems2 = this.options.selectedValue;
		 }
		 else
		 {
		    arrItems2 = this.options.currentValue;
		 }
		 
		 // populate with previous if no value set
		 if (arrItems2 === "")
		 {
		    arrItems2 = Dom.get(this.currentValueHtmlId).value;
		 }
		 
		 var onSuccess = function ObjectFinder__loadSelectedItems_onSuccess(response)
		 {
		    var items = response.json.data.items,
		       item;
		    this.selectedItems = {};

		    for (var i = 0, il = items.length; i < il; i++)
		    {
		       item = items[i];
		       this.selectedItems[item.nodeRef] = item;
		    }

		    YAHOO.Bubbling.fire("renderCurrentValue",
		    {
		       eventGroup: this
		    });
		 };
		 
		 var onFailure = function ObjectFinder__loadSelectedItems_onFailure(response)
		 {
		    this.selectedItems = null;
		 };

		 if (arrItems2 !== "")
		 {
		    Alfresco.util.Ajax.jsonRequest(
		    {

		       url: Alfresco.constants.PROXY_URI + "/multilingual/gettranslations/node?nodeRef="+ this.options.currentItem,
		       method: "GET",
		       successCallback:
		       {
		          fn: onSuccess,
		          scope: this
		       },
		       failureCallback:
		       {
		          fn: onFailure,
		          scope: this
		       }
		    });
		 }
		 else
		 {
		    // if disabled show the (None) message
		    if (this.options.disabled && this.options.displayMode == "items")
		    {
		       Dom.get(this.id + "-currentValueDisplay").innerHTML = this.msg("form.control.novalue");
		    }
		    
		    this._enableActions();
		 }
	      },
	      /**
               * Returns <selected> lang equal selected lang
               *
               * @method fnRenderCellListItemName
               */
               fnIsLangSelected: function ObjectFinder_fnIsLangSelected(lang, selectedLang)
               {
		     if (lang == selectedLang)
		     {
			return 'selected';
		     }
		     else
		     {
			return '';
                     }
		     
	       },
               /**
               * Returns Action item custom datacell formatter
               *
               * @method fnRenderCellListItemName
               */
              fnRenderCellListItemName: function ObjectFinder_fnRenderCellListItemName()
              {
                 var scope = this;
        
                 /**
                  * Action item custom datacell formatter
                  *
                  * @method fnRenderCellListItemName
                  * @param elCell {object}
                  * @param oRecord {object}
                  * @param oColumn {object}
                  * @param oData {object|string}
                  */
                 return function ObjectFinder_fnRenderCellListItemName(elCell, oRecord, oColumn, oData)
                 {
                    var item = oRecord.getData(),
                       description =  item.description ? $html(item.description) : scope.msg("label.none"),
                       modifiedOn = item.modified ? Alfresco.util.formatDate(Alfresco.util.fromISO8601(item.modified)) : null,
                       title = $html(item.name),
		       selectedLanguage,
		       dropDown;
                    if (scope.options.showLinkToTarget && scope.options.targetLinkTemplate !== null)
                    {
                       var link;
                       if (YAHOO.lang.isFunction(scope.options.targetLinkTemplate))
                       {
                          link = scope.options.targetLinkTemplate.call(scope, oRecord.getData());
                       }
                       else
                       {
                          //Discard template, build link from scratch
                          var linkTemplate = (item.site) ? Alfresco.constants.URL_PAGECONTEXT + "site/{site}/document-details?nodeRef={nodeRef}" : Alfresco.constants.URL_PAGECONTEXT + "document-details?nodeRef={nodeRef}";
                          link = YAHOO.lang.substitute(linkTemplate,
                          {
                             nodeRef : item.nodeRef,
                             site : item.site
                          });
                       }
                       title = '<a href="' + link + '">' + $html(item.name) + '</a>';
                    }
		    
		    selectedLanguage = '';

		    for (var item2 in scope.selectedItems)
                    {
                    	if (scope.selectedItems.hasOwnProperty(item2))
                    	{
			    if ( item.nodeRef == item2 )
			    {
				selectedLanguage = item.language;
			    }
                   	}
                    }

                    var languages =
				   '<select id="' + scope.id + '|language"' + ' onchange="OnSelectionChange(this);"' + ' name="' + item.nodeRef +'">' +
                       '<option id="' + scope.id + '|en" ' + scope.fnIsLangSelected('en',selectedLanguage) + ' name="' + item.nodeRef + '"' +' value="en"'+'>English</option>' +
                       '<option id="' + scope.id + '|fr" ' + scope.fnIsLangSelected('fr',selectedLanguage) + ' name="' + item.nodeRef + '"' +' value="fr"'+'>French</option>' +
                       '<option id="' + scope.id + '|es" ' + scope.fnIsLangSelected('es',selectedLanguage) + ' name="' + item.nodeRef + '"' +' value="es"'+'>Spanish</option>' +
                       '<option id="' + scope.id + '|de" ' + scope.fnIsLangSelected('de',selectedLanguage) + ' name="' + item.nodeRef + '"' +' value="de"'+'>German</option>' +
                       '<option id="' + scope.id + '|ru" ' + scope.fnIsLangSelected('ru',selectedLanguage) + ' name="' + item.nodeRef + '"' +' value="ru"'+'>Russian</option>' +
                       '<option id="' + scope.id + '|zh" ' + scope.fnIsLangSelected('zh',selectedLanguage) + ' name="' + item.nodeRef + '"' +' value="zh"'+'>Chinese</option>' +
                       '<option id="' + scope.id + '|ar" ' + scope.fnIsLangSelected('ar',selectedLanguage) + ' name="' + item.nodeRef + '"' +' value="ar"'+'>Arabic</option>' +
                       '<option id="' + scope.id + '|ja" ' + scope.fnIsLangSelected('ja',selectedLanguage) + ' name="' + item.nodeRef + '"' +' value="ja"'+'>Japanese</option>' +


                       //'<option id="' + scope.id + '|en" ' + scope.fnIsLangSelected('en',selectedLanguage) + ' name="' + item.nodeRef + '"' +' value="en"'+'>English</option>' +
                       //'<option id="' + scope.id + '|fr" ' + scope.fnIsLangSelected('fr',selectedLanguage) + ' name="' + item.nodeRef + '"' +' value="fr"'+'>French</option>' +
                       //'<option id="' + scope.id + '|es" ' + scope.fnIsLangSelected('es',selectedLanguage) + ' name="' + item.nodeRef + '"' +' value="es"'+'>Spanish</option>' +
                       //'<option id="' + scope.id + '|de" ' + scope.fnIsLangSelected('de',selectedLanguage) + ' name="' + item.nodeRef + '"' +' value="de"'+'>German</option>' +
                       //'<option id="' + scope.id + '|ru" ' + scope.fnIsLangSelected('ru',selectedLanguage) + ' name="' + item.nodeRef + '"' +' value="ru"'+'>Russian</option>' +
                       //'<option id="' + scope.id + '|zh" ' + scope.fnIsLangSelected('zh',selectedLanguage) + ' name="' + item.nodeRef + '"' +' value="zh"'+'>Chinese</option>' +
                       //'<option id="' + scope.id + '|ar" ' + scope.fnIsLangSelected('ar',selectedLanguage) + ' name="' + item.nodeRef + '"' +' value="ar"'+'>Arabic</option>' +
                       //'<option id="' + scope.id + '|ja" ' + scope.fnIsLangSelected('ja',selectedLanguage) + ' name="' + item.nodeRef + '"' +' value="ja"'+'>Japanese</option>' +
                   '</select>';
                    var template = '<h3 class="name">' + title + '</h3>';
                    template += '<div class="description">' + scope.msg("form.control.object-picker.description") + ': ' + description + '</div>';
                    template += '<div class="viewmode-label">Selected language:'+ languages  + '</div>';
		    
                    elCell.innerHTML = template;
                 };
              }
            }
            );  //end of extend
    })();
