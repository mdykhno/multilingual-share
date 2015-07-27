 (function() {
    YAHOO.Bubbling.fire("registerAction",
    {
        actionName: "onRemoveTranslation",
        fn: function alfresco_onRemoveTranslation(file) {
            this.modules.actions.genericAction(
            {
                success:
                {
               	  event:
               	  {
                  	name: "metadataRefresh"
                  },
                  message: this.msg("message.removeTranslation.success")
                },
                failure:
                {
                    message: this.msg("message.removeTranslation.failure")
                },
                webscript:
                {
                    name: "multilingual/removetranslation?nodeRef={nodeRef}",
                    stem: Alfresco.constants.PROXY_URI,
                    method: Alfresco.util.Ajax.GET,
                    params:
                    {
                        nodeRef: file.nodeRef,
                        userName: Alfresco.constants.USERNAME
                    }
                },
                config:
                {
                }
            });
        }
    });
})();
