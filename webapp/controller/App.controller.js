sap.ui.define(
    [
        "sap/ui/core/mvc/Controller",
		'sap/ui/model/json/JSONModel'
    ],
    function(BaseController, JSONModel) {
      "use strict";
  
      return BaseController.extend("apphdlfiles.controller.controller.App", {
        onInit() {
            var that = this;
                $.ajax({
                    url: that._getODataRuntimeBaseURL() + "/user/home/?op=LISTSTATUS",
                    type: 'GET',
                    dataType: 'json', // added data type
                    success: function (res) {
                        console.log(res);
                        var wbsTempalteModelData = new JSONModel();
                        wbsTempalteModelData.setData(res);
                        that.getView().setModel(wbsTempalteModelData, "DataModel");
                    }
                });
        },
        _getODataRuntimeBaseURL: function () {
            var appId = this.getOwnerComponent().getManifestEntry("/sap.app/id");
            var appPath = appId.replaceAll(".", "/");
            var appModulePath = jQuery.sap.getModulePath(appPath);
            return appModulePath + "/webhdfs/v1";
        },
        handleUploadComplete: function(oEvent) {
			var sResponse = oEvent.getParameter("response"),
				iHttpStatusCode = parseInt(/\d{3}/.exec(sResponse)[0]),
				sMessage;

			if (sResponse) {
				sMessage = iHttpStatusCode === 200 ? sResponse + " (Upload Success)" : sResponse + " (Upload Error)";
				MessageToast.show(sMessage);
			}
		},

		handleUploadPress: function() {
			var oFileUploader = this.byId("fileUploader");
			oFileUploader.checkFileReadable().then(function() {
				oFileUploader.upload();
			}, function(error) {
				MessageToast.show("The file cannot be read. It may have changed.");
			}).then(function() {
				oFileUploader.clear();
			});
		},

        onSelectTab: function (event) {
			var oLabel = this.byId('labelId');
			var oTab = event.getParameter('item');
            //var oItem = oEvent.getParameter("item");
            //var navCon = this.byId("navCon");
            //var pageid = oTab.getText()
                
            this.byId("navCon").to(this.byId(oTab.getKey()), "Slide animation");
            //this.byId("navCon").to(this.getView().createId(oItem.getKey()));
			oLabel.setText(oTab.getText());
		}

      });
    }
  );
  