/* global highcharts:true */

sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"./CustomerFormat",
	'sap/ui/core/util/Export',
	'sap/ui/core/util/ExportTypeCSV',
	"sap/ui/export/Spreadsheet",
], function(Controller, CustomerFormat, Export, ExportTypeCSV, Spreadsheet) {
	// "use strict";
 
	return Controller.extend("actionsresults.controller.Level", {
		_selectedData: [],
		onInit: function() { 
		},
		boldName: function(sName) {
			if (sName != null) {
				return sName.toString().replace(/,/g, '\n');
			}
		},
		defaultname:function(sName){
			return sName;
		},
		onAfterRendering: async function() {
			var superadmin = new sap.ui.model.json.JSONModel();
			sap.ui.getCore().setModel(superadmin, "superadmin");
			superadmin.setData("");
			
            if (sap.ushell && sap.ushell.cpv2 && sap.ushell.cpv2.services && sap.ushell.cpv2.services.cloudServices && sap.ushell.cpv2.services.cloudServices.SiteService) {

                var oLocalSiteService = sap.ushell.cpv2.services.cloudServices.SiteService();
                var oRoles = oLocalSiteService.siteModel.getProperty("/roles");
                var oProperty;


                for (oProperty in oRoles) {

                    if (oRoles.hasOwnProperty(oProperty)) {
                        if (oProperty.toString() === "SiteAdmin"){
				/// Some action based on the Test_Role
							superadmin.setData("superadmin");
                        }
                    }
                }
            }
			document.title = "Best Practices Dashboard";
			this.getView().byId("filterLabel").setText("All Customers");
			this.getView().byId("cancelBtn").setVisible(false);
			/**
			 * default date range selection  
			 * */
			var Datetoday = new Date();
			
			var fDate = new Date();
			// fDate.setDate((fDate.getDate() - 30) + 1);
			fDate.setMonth((fDate.getMonth() - 12));
			fDate.setDate(fDate.getDate() + 1);
			// if(fDate.getDate()!=1){
			// 	fDate.setDate(1);
			// }
			
		
			
			
			
			// if(fDate.getMonth()!=Datetoday.getMonth()){
			// 	fDate.setDate(1);
			// }
			var tDate = Datetoday.YYYYMMDD();
			fDate = fDate.YYYYMMDD();

			/** 
			 * date range functionality
			 * */
			var oModel = new sap.ui.model.json.JSONModel();
			oModel.setData({
				delimiterDRS1: "~",
				dateValueDRS1: stringToDate(fDate),
				secondDateValueDRS1: stringToDate(tDate),
				dateFormatDRS1: "yyyy-MM-dd"
			});
			// sap.ui.getCore().setModel(oModel, 'dateModel');

			this.getView().byId("dateviewrange").setDateValue(stringToDate(fDate));
			this.getView().byId("dateviewrange").setSecondDateValue(stringToDate(tDate));

			var tempDateBtn = this.getView().byId("dateview").getSelectedButton().split("--")[1];
			if (tempDateBtn == "btn1Day") {
				
				var Datetoday = new Date();
				var toDate = new Date();
				toDate = toDate.YYYYMMDD();

				var fromDate = new Date();
				fromDate.setDate((fromDate.getDate() - 1) );
				// if(fromDate.getDate()!=1){
				// 	fromDate.setDate(1);
				// }
				var fromDateDay = fromDate.YYYYMMDD();

				var fromCompDate = fromDate.toISOString();
				var toCompDateTemp = Datetoday.toISOString();
			} else if (tempDateBtn == "btn1Month") {
				var Datetoday = new Date();
				var fromDate = new Date();
				fromDate.setDate((fromDate.getDate() - 30) + 1);
				
				// if(fromDate.getDate()!=1){
				// 	fromDate.setDate(1);
				// }
				
				// fromDate = fromDate.YYYYMMDD();

				var fromCompDate = fromDate.toISOString();
				var toCompDateTemp = Datetoday.toISOString();
			} else if (tempDateBtn == "btn3Month") {
				var Datetoday = new Date();
				var fromDate = new Date();
				fromDate.setMonth((fromDate.getMonth() - 3));
				fromDate.setDate(fromDate.getDate() + 1);
				
				// if(fromDate.getDate()!=1){
				// 	fromDate.setDate(1);
				// }
				
				// fromDate = fromDate.YYYYMMDD();

				var fromCompDate = fromDate.toISOString();
				var toCompDateTemp = Datetoday.toISOString();
			} else if (tempDateBtn == "btn6Month") {
				var Datetoday = new Date();
				var fromDate = new Date();
				fromDate.setMonth((fromDate.getMonth() - 6));
				fromDate.setDate(fromDate.getDate() + 1);
				
				// if(fromDate.getDate()!=1){
				// 	fromDate.setDate(1);
				// }
				
				// fromDate = fromDate.YYYYMMDD();

				var fromCompDate = fromDate.toISOString();
				var toCompDateTemp = Datetoday.toISOString();
			} else if (tempDateBtn == "btn1Year") {
				var Datetoday = new Date();
				var fromDate = new Date();
				fromDate.setMonth((fromDate.getMonth() - 12));
				fromDate.setDate(fromDate.getDate() + 1);
				
				// if(fromDate.getDate()!=1){
				// 	fromDate.setDate(1);
				// }
				
				// fromDate = fromDate.YYYYMMDD();

				var fromCompDate = fromDate.toISOString();
				var toCompDateTemp = Datetoday.toISOString();
			} else if (tempDateBtn == "btn2Year") {
				var Datetoday = new Date();
				var fromDate = new Date();
				fromDate.setMonth((fromDate.getMonth() - 24));
				fromDate.setDate(fromDate.getDate() + 1);
				
				// if(fromDate.getDate()!=1){
				// 	fromDate.setDate(1);
				// }
				
				// fromDate = fromDate.YYYYMMDD();

				var fromCompDate = fromDate.toISOString();
				var toCompDateTemp = Datetoday.toISOString();
			}

			let aResponse;
			const sServiceURL = this.getOwnerComponent().getManifestObject().resolveUri(`odata/v4/report/UpgradeElements`);
			aResponse = (await (await fetch(sServiceURL.concat(`?$filter=PRODUCT_NAME eq 'Employee Central'`))).json());
            const oModelUpgradeRecruitEC = new sap.ui.model.json.JSONModel(aResponse.value);
			sap.ui.getCore().setModel(oModelUpgradeRecruitEC, "oModelUpgradeRecruitEC");

			aResponse = (await (await fetch(sServiceURL.concat(`?$filter=PRODUCT_NAME eq 'Succession Management'`))).json());
            const oModelUpgradeRecruitSM = new sap.ui.model.json.JSONModel(aResponse.value);
			sap.ui.getCore().setModel(oModelUpgradeRecruitSM, "oModelUpgradeRecruitSM");

			aResponse = (await (await fetch(sServiceURL.concat(`?$filter=PRODUCT_NAME eq 'Performance and Goals'`))).json());
            const oModelUpgradeRecruitPG = new sap.ui.model.json.JSONModel(aResponse.value);
			sap.ui.getCore().setModel(oModelUpgradeRecruitPG, "oModelUpgradeRecruitPG");

			aResponse = (await (await fetch(sServiceURL.concat(`?$filter=PRODUCT_NAME eq 'Compensation'`))).json());
            const oModelUpgradeRecruitCO = new sap.ui.model.json.JSONModel(aResponse.value);
			sap.ui.getCore().setModel(oModelUpgradeRecruitCO, "oModelUpgradeRecruitCO");

			aResponse = (await (await fetch(sServiceURL.concat(`?$filter=PRODUCT_NAME eq 'Onboarding'`))).json());
            const oModelUpgradeRecruitON = new sap.ui.model.json.JSONModel(aResponse.value);
			sap.ui.getCore().setModel(oModelUpgradeRecruitON, "oModelUpgradeRecruitON");

			aResponse = (await (await fetch(sServiceURL.concat(`?$filter=PRODUCT_NAME eq 'Recruiting Management'`))).json());
            const oModelUpgradeRecruitREC = new sap.ui.model.json.JSONModel(aResponse.value);
			sap.ui.getCore().setModel(oModelUpgradeRecruitREC, "oModelUpgradeRecruitREC");
			
			let sURL = this.getOwnerComponent().getManifestObject().resolveUri("sap/sfsf_repo/service/services.xsodata/");
			var ODataModel = new sap.ui.model.odata.ODataModel(sURL, true); // Changes made on 16/03/2017 and on 16/03/2018
			ODataModel.setDefaultCountMode(false);
			ODataModel.setDefaultBindingMode(sap.ui.model.BindingMode.TwoWay);
			this.getView().setModel(ODataModel);

			fromCompDate = fromCompDate.split("T")[0] + "T00:00";
			toCompDateTemp = toCompDateTemp.split("T")[0] + "T24:00";
			var tempDateTo = (new Date(toCompDateTemp)).getDate();
			var d = new Date(toCompDateTemp);
			d.setDate(tempDateTo);
			var toCompDate = d.toISOString();
			toCompDate = toCompDate.split("T")[0] + "T24:00";
			
			var oModelUpgradeRefData = new sap.ui.model.json.JSONModel();
			oModelUpgradeRefData.setSizeLimit(50000);
			sap.ui.getCore().setModel(oModelUpgradeRefData, "oModelUpgradeRefData");
			
			
			var oModelUpgradeRefDataUpgrade = new sap.ui.model.json.JSONModel();
			oModelUpgradeRefDataUpgrade.setSizeLimit(50000);
			sap.ui.getCore().setModel(oModelUpgradeRefDataUpgrade, "oModelUpgradeRefDataUpgrade");
			
			
			//this.showBusyIndicator(10000, 0);
			this.loadKPINumbers(ODataModel, "", fromCompDate, toCompDate);
			this.loadDDlVersion(ODataModel, fromCompDate, toCompDate);
			//this.callMainRef(ODataModel,"");
			this.CallCustomerData(ODataModel, "", fromCompDate, toCompDate, "");
			
			// this.loadChartBottom(ODataModel, "", fromCompDate,toCompDate);
			this.loadLineChartBottom(ODataModel, "", fromCompDate, toCompDate);
			this.loadLineChart(ODataModel, "", fromCompDate, toCompDate);
			
			
			this.loadDailyChart(ODataModel,"","","");
			
			$(".parentHBoxAction").css('height',$(window).height() - 160 + "px");
			
			this.getView().byId("tableSc").setHeight($(window).height() - 350 + "px");

		},

		hideBusyIndicator: function () {
			sap.ui.core.BusyIndicator.hide();
		},

		showBusyIndicator: function (iDuration, iDelay) {
			sap.ui.core.BusyIndicator.show(iDelay);

			if (iDuration && iDuration > 0) {
				if (this._sTimeoutId) {
					jQuery.sap.clearDelayedCall(this._sTimeoutId);
					this._sTimeoutId = null;
				}

				this._sTimeoutId = jQuery.sap.delayedCall(iDuration, this, function () {
					this.hideBusyIndicator();
				});
			}
		},
		
		onClearCharts:function(){
			// var chart = $("#repoContainerReview").highcharts();
			// var selectedPoints = chart.getSelectedPoints();
			// if(selectedPoints.length>0){
			// 	selectedPoints[0].select();	
			// }
	        // selectedPoints[0].select();
        
        	var chartArea = $("#repoContainerReviewArea").highcharts();
			var selectedPointsArea = chartArea.getSelectedPoints();
			if(selectedPointsArea.length>0){
				selectedPointsArea[0].select();	
			}
			
			var chartDay = $("#repoContainerReviewAreaDay").highcharts();
			var selectedPointsDay = chartDay.getSelectedPoints();
			if(selectedPointsDay.length>0){
				selectedPointsDay[0].select();	
			}
			
			// this.getView().byId("HBarChart").vizSelection([], {
			// 	"clearSelection": true
			// });
			
			var aFilters = [];
	
			// update list binding
			var list = this.getView().byId("listTable");
			var binding = list.getBinding("items");
			binding.filter(aFilters, "Application");
			this.getView().byId("filterLabel").setText("All Customers");
			this.getView().byId("cancelBtn").setVisible(false);
		},
		onSearch: function(oEvt) {
			// add filter for search
			var aFilters = [];
			var sQuery = oEvt.getSource().getValue();
			if (sQuery && sQuery.length > 0) {
				var filter = new sap.ui.model.Filter("val", sap.ui.model.FilterOperator.Contains, sQuery);
				aFilters.push(filter);
			}
			// update list binding
			var list = this.getView().byId("listTable");
			var binding = list.getBinding("items");
			binding.filter(aFilters, "Application");
		},
		ddlProductChanged:function(oEvt){
			
			var self = this;
			self.stat = true;
			self.state = false;

			if (self.stat == true) {
				var tempDateBtn = this.getView().byId("dateview").getSelectedButton().split("--")[1];
				if (tempDateBtn == "btn1Day") {
				
				var Datetoday = new Date();
				var toDate = new Date();
				toDate = toDate.YYYYMMDD();

				var fromDate = new Date();
				fromDate.setDate((fromDate.getDate() - 1) );
				// if(fromDate.getDate()!=1){
				// 	fromDate.setDate(1);
				// }
				var fromDateDay = fromDate.YYYYMMDD();

				var fromCompDate = fromDate.toISOString();
				var toCompDateTemp = Datetoday.toISOString();
			} else if (tempDateBtn == "btn1Month") {
					var Datetoday = new Date();
					var fromDate = new Date();
					fromDate.setDate((fromDate.getDate() - 30) + 1);
					// if(fromDate.getDate()!=1){
						// fromDate.setDate(1);
					// }
					// fromDate = fromDate.YYYYMMDD();

					var fromCompDate = fromDate.toISOString();
					var toCompDateTemp = Datetoday.toISOString();
				} else if (tempDateBtn == "btn3Month") {
					var Datetoday = new Date();
					var fromDate = new Date();
					fromDate.setMonth((fromDate.getMonth() - 3));
					fromDate.setDate(fromDate.getDate() + 1);
					// if(fromDate.getDate()!=1){
						// fromDate.setDate(1);
					// }

					var fromCompDate = fromDate.toISOString();
					var toCompDateTemp = Datetoday.toISOString();
				} else if (tempDateBtn == "btn6Month") {
					var Datetoday = new Date();
					var fromDate = new Date();
					fromDate.setMonth((fromDate.getMonth() - 6));
					fromDate.setDate(fromDate.getDate() + 1);
					// if(fromDate.getDate()!=1){
					// 	fromDate.setDate(1);
					// }
					// fromDate = fromDate.YYYYMMDD();

					var fromCompDate = fromDate.toISOString();
					var toCompDateTemp = Datetoday.toISOString();
				} else if (tempDateBtn == "btn1Year") {
					var Datetoday = new Date();
					var fromDate = new Date();
					fromDate.setMonth((fromDate.getMonth() - 12));
					fromDate.setDate(fromDate.getDate() + 1);
					// if(fromDate.getDate()!=1){
					// 	fromDate.setDate(1);
					// }
					// fromDate = fromDate.YYYYMMDD();

					var fromCompDate = fromDate.toISOString();
					var toCompDateTemp = Datetoday.toISOString();
				} else if (tempDateBtn == "btn2Year") {
					var Datetoday = new Date();
					var fromDate = new Date();
					fromDate.setMonth((fromDate.getMonth() - 24));
					fromDate.setDate(fromDate.getDate() + 1);
					// if(fromDate.getDate()!=1){
					// 	fromDate.setDate(1);
					// }
					// fromDate = fromDate.YYYYMMDD();

					var fromCompDate = fromDate.toISOString();
					var toCompDateTemp = Datetoday.toISOString();
				}else {
				var fromDateVal = this.getView().byId("dateviewrange").getDateValue();
				var toDateVal = this.getView().byId("dateviewrange").getSecondDateValue();

				var fromCompDate = fromDateVal.toISOString();
				var toCompDateTemp = toDateVal.toISOString();
			}
			} else {
				var fromDateVal = this.getView().byId("dateviewrange").getDateValue();
				var toDateVal = this.getView().byId("dateviewrange").getSecondDateValue();

				var fromCompDate = fromDateVal.toISOString();
				var toCompDateTemp = toDateVal.toISOString();
			}

			var mdl = this.getView().getModel();

			// var groups = this.getView().byId("ddlVersion").getValue();
			// if (groups == "") {
			// 	this.getView().byId("ddlVersion").setValue("Build Version");
			// 	this.getView().byId("ddlVersion").setSelectedKey("Build Version");
			// }
			var tempKey = this.getView().byId("ddlVersion").getSelectedKey();
			if (tempKey == "Version") {
				tempKey = "";
			}

			// this.getView().byId("ddlUpgrade").setSelectedKey("All");
			// this.ddlUpgradeChanged();
			this.getView().byId("filterLabel").setText("All Customers");
			this.getView().byId("cancelBtn").setVisible(false);
			this.getView().byId("searchfield").setValue("");

			fromCompDate = fromCompDate.split("T")[0] + "T00:00";
			toCompDateTemp = toCompDateTemp.split("T")[0] + "T24:00";
			var tempDateTo = (new Date(toCompDateTemp)).getDate();
			var d = new Date(toCompDateTemp);
			d.setDate(tempDateTo);
			var toCompDate = d.toISOString();
			toCompDate = toCompDate.split("T")[0] + "T24:00";

this.showBusyIndicator(10000, 0);

this.loadKPINumbers(mdl, tempKey, fromCompDate, toCompDate);
			// this.loadChartBottom(mdl, tempKey, fromCompDate,toCompDate);
			this.loadLineChartBottom(mdl, tempKey, fromCompDate, toCompDate);
			this.loadLineChart(mdl, tempKey, fromCompDate, toCompDate);
			
			
			this.CallCustomerData(mdl, tempKey, fromCompDate, toCompDate, "");
			
			this.loadDailyChart(mdl, tempKey, "", "", "");
		
		},
		
		ddlDeployChanged:function(oEvt){
			
			var self = this;
			self.stat = true;
			self.state = false;

			if (self.stat == true) {
				var tempDateBtn = this.getView().byId("dateview").getSelectedButton().split("--")[1];
				if (tempDateBtn == "btn1Day") {
				
				var Datetoday = new Date();
				var toDate = new Date();
				toDate = toDate.YYYYMMDD();

				var fromDate = new Date();
				fromDate.setDate((fromDate.getDate() - 1) );
				// if(fromDate.getDate()!=1){
				// 	fromDate.setDate(1);
				// }
				var fromDateDay = fromDate.YYYYMMDD();

				var fromCompDate = fromDate.toISOString();
				var toCompDateTemp = Datetoday.toISOString();
			} else if (tempDateBtn == "btn1Month") {
					var Datetoday = new Date();
					var fromDate = new Date();
					fromDate.setDate((fromDate.getDate() - 30) + 1);
					// if(fromDate.getDate()!=1){
					// 	fromDate.setDate(1);
					// }
					// fromDate = fromDate.YYYYMMDD();

					var fromCompDate = fromDate.toISOString();
					var toCompDateTemp = Datetoday.toISOString();
				} else if (tempDateBtn == "btn3Month") {
					var Datetoday = new Date();
					var fromDate = new Date();
					fromDate.setMonth((fromDate.getMonth() - 3));
					fromDate.setDate(fromDate.getDate() + 1);
					// if(fromDate.getDate()!=1){
					// 	fromDate.setDate(1);
					// }

					var fromCompDate = fromDate.toISOString();
					var toCompDateTemp = Datetoday.toISOString();
				} else if (tempDateBtn == "btn6Month") {
					var Datetoday = new Date();
					var fromDate = new Date();
					fromDate.setMonth((fromDate.getMonth() - 6));
					fromDate.setDate(fromDate.getDate() + 1);
					// if(fromDate.getDate()!=1){
					// 	fromDate.setDate(1);
					// }
					// fromDate = fromDate.YYYYMMDD();

					var fromCompDate = fromDate.toISOString();
					var toCompDateTemp = Datetoday.toISOString();
				} else if (tempDateBtn == "btn1Year") {
					var Datetoday = new Date();
					var fromDate = new Date();
					fromDate.setMonth((fromDate.getMonth() - 12));
					fromDate.setDate(fromDate.getDate() + 1);
					// if(fromDate.getDate()!=1){
					// 	fromDate.setDate(1);
					// }
					// fromDate = fromDate.YYYYMMDD();

					var fromCompDate = fromDate.toISOString();
					var toCompDateTemp = Datetoday.toISOString();
				} else if (tempDateBtn == "btn2Year") {
					var Datetoday = new Date();
					var fromDate = new Date();
					fromDate.setMonth((fromDate.getMonth() - 24));
					fromDate.setDate(fromDate.getDate() + 1);
					// if(fromDate.getDate()!=1){
					// 	fromDate.setDate(1);
					// }
					// fromDate = fromDate.YYYYMMDD();

					var fromCompDate = fromDate.toISOString();
					var toCompDateTemp = Datetoday.toISOString();
				}else {
				var fromDateVal = this.getView().byId("dateviewrange").getDateValue();
				var toDateVal = this.getView().byId("dateviewrange").getSecondDateValue();

				var fromCompDate = fromDateVal.toISOString();
				var toCompDateTemp = toDateVal.toISOString();
			}
			} else {
				var fromDateVal = this.getView().byId("dateviewrange").getDateValue();
				var toDateVal = this.getView().byId("dateviewrange").getSecondDateValue();

				var fromCompDate = fromDateVal.toISOString();
				var toCompDateTemp = toDateVal.toISOString();
			}

			var mdl = this.getView().getModel();

			// var groups = this.getView().byId("ddlVersion").getValue();
			// if (groups == "") {
			// 	this.getView().byId("ddlVersion").setValue("Build Version");
			// 	this.getView().byId("ddlVersion").setSelectedKey("Build Version");
			// }
			var tempKey = this.getView().byId("ddlVersion").getSelectedKey();
			if (tempKey == "Version") {
				tempKey = "";
			}

			// this.getView().byId("ddlUpgrade").setSelectedKey("All");
			// this.ddlUpgradeChanged();
			this.getView().byId("filterLabel").setText("All Customers");
			this.getView().byId("cancelBtn").setVisible(false);
			this.getView().byId("searchfield").setValue("");

			fromCompDate = fromCompDate.split("T")[0] + "T00:00";
			toCompDateTemp = toCompDateTemp.split("T")[0] + "T24:00";
			var tempDateTo = (new Date(toCompDateTemp)).getDate();
			var d = new Date(toCompDateTemp);
			d.setDate(tempDateTo);
			var toCompDate = d.toISOString();
			toCompDate = toCompDate.split("T")[0] + "T24:00";

this.showBusyIndicator(10000, 0);
this.loadKPINumbers(mdl, tempKey, fromCompDate, toCompDate);
			this.loadLineChartBottom(mdl, tempKey, fromCompDate, toCompDate);
			this.loadLineChart(mdl, tempKey, fromCompDate, toCompDate);
			
			this.CallCustomerData(mdl, tempKey, fromCompDate, toCompDate, "");
			this.loadDailyChart(mdl, tempKey, "", "", "");
		
		},


		ddlVersionChanged: function() {
			var self = this;
			self.stat = true;
			self.state = false;

			if (self.stat == true) {
				var tempDateBtn = this.getView().byId("dateview").getSelectedButton().split("--")[1];
				if (tempDateBtn == "btn1Day") {
				
				var Datetoday = new Date();
				var toDate = new Date();
				toDate = toDate.YYYYMMDD();

				var fromDate = new Date();
				fromDate.setDate((fromDate.getDate() - 1) );
				// if(fromDate.getDate()!=1){
				// 	fromDate.setDate(1);
				// }
				var fromDateDay = fromDate.YYYYMMDD();

				var fromCompDate = fromDate.toISOString();
				var toCompDateTemp = Datetoday.toISOString();
			} else if (tempDateBtn == "btn1Month") {
					var Datetoday = new Date();
					var fromDate = new Date();
					fromDate.setDate((fromDate.getDate() - 30) + 1);
					// if(fromDate.getDate()!=1){
					// 	fromDate.setDate(1);
					// }
					// fromDate = fromDate.YYYYMMDD();

					var fromCompDate = fromDate.toISOString();
					var toCompDateTemp = Datetoday.toISOString();
				} else if (tempDateBtn == "btn3Month") {
					var Datetoday = new Date();
					var fromDate = new Date();
					fromDate.setMonth((fromDate.getMonth() - 3));
					fromDate.setDate(fromDate.getDate() + 1);
					// if(fromDate.getDate()!=1){
					// 	fromDate.setDate(1);
					// }

					var fromCompDate = fromDate.toISOString();
					var toCompDateTemp = Datetoday.toISOString();
				} else if (tempDateBtn == "btn6Month") {
					var Datetoday = new Date();
					var fromDate = new Date();
					fromDate.setMonth((fromDate.getMonth() - 6));
					fromDate.setDate(fromDate.getDate() + 1);
					// if(fromDate.getDate()!=1){
					// 	fromDate.setDate(1);
					// }
					// fromDate = fromDate.YYYYMMDD();

					var fromCompDate = fromDate.toISOString();
					var toCompDateTemp = Datetoday.toISOString();
				} else if (tempDateBtn == "btn1Year") {
					var Datetoday = new Date();
					var fromDate = new Date();
					fromDate.setMonth((fromDate.getMonth() - 12));
					fromDate.setDate(fromDate.getDate() + 1);
					// if(fromDate.getDate()!=1){
					// 	fromDate.setDate(1);
					// }
					// fromDate = fromDate.YYYYMMDD();

					var fromCompDate = fromDate.toISOString();
					var toCompDateTemp = Datetoday.toISOString();
				} else if (tempDateBtn == "btn2Year") {
					var Datetoday = new Date();
					var fromDate = new Date();
					fromDate.setMonth((fromDate.getMonth() - 24));
					fromDate.setDate(fromDate.getDate() + 1);
					// if(fromDate.getDate()!=1){
					// 	fromDate.setDate(1);
					// }
					// fromDate = fromDate.YYYYMMDD();

					var fromCompDate = fromDate.toISOString();
					var toCompDateTemp = Datetoday.toISOString();
				}else {
				var fromDateVal = this.getView().byId("dateviewrange").getDateValue();
				var toDateVal = this.getView().byId("dateviewrange").getSecondDateValue();

				var fromCompDate = fromDateVal.toISOString();
				var toCompDateTemp = toDateVal.toISOString();
			}
			} else {
				var fromDateVal = this.getView().byId("dateviewrange").getDateValue();
				var toDateVal = this.getView().byId("dateviewrange").getSecondDateValue();

				var fromCompDate = fromDateVal.toISOString();
				var toCompDateTemp = toDateVal.toISOString();
			}

			var mdl = this.getView().getModel();

			// var groups = this.getView().byId("ddlVersion").getValue();
			// if (groups == "") {
			// 	this.getView().byId("ddlVersion").setValue("Build Version");
			// 	this.getView().byId("ddlVersion").setSelectedKey("Build Version");
			// }
			// var tempKey = this.getView().byId("ddlVersion").getSelectedKey();
			// if (tempKey == "Version") {
			// 	tempKey = "";
			// }
			var tempKey = this.getView().byId("ddlVersion").getSelectedKey();
			if(tempKey!="Version"&&tempKey!="b1808/"&&tempKey!="b1811/"&&tempKey!="b1902/"&&tempKey!="b1905/"&&tempKey!="b1908/"&&tempKey!="b1911/"&&tempKey!="b2002/"&&tempKey!="b2005/"&&tempKey!="b2008/"&&tempKey!="b2011/"&&tempKey!=""){
				this.getView().byId("ddlProd").setSelectedKey("EC");
				this.getView().byId("ddlProd").setEnabled(false);
			}else{
				this.getView().byId("ddlProd").setSelectedKey("All");
				this.getView().byId("ddlProd").setEnabled(true);
			}
			if (tempKey == "Version") {
				tempKey = "";
			}

			// this.getView().byId("ddlUpgrade").setSelectedKey("All");
			// this.ddlUpgradeChanged();
			this.getView().byId("filterLabel").setText("All Customers");
			this.getView().byId("cancelBtn").setVisible(false);
			this.getView().byId("searchfield").setValue("");

			fromCompDate = fromCompDate.split("T")[0] + "T00:00";
			toCompDateTemp = toCompDateTemp.split("T")[0] + "T24:00";
			var tempDateTo = (new Date(toCompDateTemp)).getDate();
			var d = new Date(toCompDateTemp);
			d.setDate(tempDateTo);
			var toCompDate = d.toISOString();
			toCompDate = toCompDate.split("T")[0] + "T24:00";
			
			
			var oModelUpgradeRefData = new sap.ui.model.json.JSONModel();
			oModelUpgradeRefData.setSizeLimit(50000);
			sap.ui.getCore().setModel(oModelUpgradeRefData, "oModelUpgradeRefData");
			
			
			var oModelUpgradeRefDataUpgrade = new sap.ui.model.json.JSONModel();
			oModelUpgradeRefDataUpgrade.setSizeLimit(50000);
			sap.ui.getCore().setModel(oModelUpgradeRefDataUpgrade, "oModelUpgradeRefDataUpgrade");
			
			this.showBusyIndicator(10000, 0);
			this.loadKPINumbers(mdl, tempKey, fromCompDate, toCompDate);
			
			// this.loadChartBottom(mdl, tempKey, fromCompDate,toCompDate);
			this.loadLineChartBottom(mdl, tempKey, fromCompDate, toCompDate);
			this.loadLineChart(mdl, tempKey, fromCompDate, toCompDate);
			// this.loadKPINumbers(mdl, tempKey, fromCompDate, toCompDate);
			this.CallCustomerData(mdl, tempKey, fromCompDate, toCompDate, "");
			
			this.loadDailyChart(mdl, tempKey, "", "", "");
		},
		// ddlSPChanged: function(evt) {
		// 	var _temp1 = "";
		// 	var _temp2 = "";

		// 	var fillBP = "";
		// 	var fillBPAry = [];
		// 	var tmpStrg = "";
		// 	var self = this;
		// 	this.getView().byId("searchfield").setValue("");

		// 	if (this.getView().byId("ddlSP").getSelectedKeys().length == 0) {
		// 		this.getView().byId("ddlSP").setSelectedKeys("All");
		// 		fillBP = "";
		// 	} else if (this.getView().byId("ddlSP").getSelectedKeys().length == 1) {
		// 		var tempArray = this.getView().byId("ddlSP").getSelectedKeys();
		// 		if (tempArray.indexOf("All") > -1) {
		// 			fillBP = "";
		// 		} else {
		// 			// tempStr = JSON.stringify(sap.ui.getCore().byId("ddlSP").getSelectedKeys());
		// 			// _temp1 = (tempStr.split("[")[1]).split("]")[0];
		// 			// _temp2 = _temp1.replace(/("|')/g, "'");
		// 			// that._tempT = _temp2.replace(/,/g, "','");

		// 			for(var q=0;q<tempArray.length;q++){
		// 				if(q==tempArray.length-1){
		// 					fillBPAry.push("UPGRADE_ELEMENT eq '"+tempArray[q]+"'");
		// 				}else{
		// 					fillBPAry.push("UPGRADE_ELEMENT eq '"+tempArray[q]+"' or ");
		// 				}

		// 			}
		// 			tmpStrg = JSON.stringify(fillBPAry);
		// 			_temp1 = (tmpStrg.split("[")[1]).split("]")[0];
		// 			_temp2 = _temp1.replace(/"/g,"");
		// 			fillBP = _temp2.replace(/,/g,"");

		// 		}
		// 	} else {
		// 		var tempArray = this.getView().byId("ddlSP").getSelectedKeys();
		// 		if (tempArray.indexOf("All") == 0) {
		// 			tempArray.splice(tempArray.indexOf("All"), 1);
		// 			// tempStr = JSON.stringify(tempArray);
		// 			// _temp1 = (tempStr.split("[")[1]).split("]")[0];
		// 			// _temp2 = _temp1.replace(/("|')/g, "'");
		// 			// that._tempT = _temp2.replace(/,/g, "','");

		// 			for(var q=0;q<tempArray.length;q++){
		// 				if(q==tempArray.length-1){
		// 					fillBPAry.push("UPGRADE_ELEMENT eq '"+tempArray[q]+"'");
		// 				}else{
		// 					fillBPAry.push("UPGRADE_ELEMENT eq '"+tempArray[q]+"' or ");
		// 				}

		// 			}
		// 			tmpStrg = JSON.stringify(fillBPAry);
		// 			_temp1 = (tmpStrg.split("[")[1]).split("]")[0];
		// 			_temp2 = _temp1.replace(/"/g,"");
		// 			fillBP = _temp2.replace(/,/g,"");

		// 			this.getView().byId("ddlSP").setSelectedKeys(tempArray);

		// 		} else if (tempArray.indexOf("All") > 0) {
		// 			this.getView().byId("ddlSP").setSelectedKeys("All");
		// 			fillBP = "";
		// 		} else {
		// 			// tempStr = JSON.stringify(tempArray);
		// 			// _temp1 = (tempStr.split("[")[1]).split("]")[0];
		// 			// _temp2 = _temp1.replace(/("|')/g, "'");
		// 			// that._tempT = _temp2.replace(/,/g, "','");

		// 			for(var q=0;q<tempArray.length;q++){
		// 				if(q==tempArray.length-1){
		// 					fillBPAry.push("UPGRADE_ELEMENT eq '"+tempArray[q]+"'");
		// 				}else{
		// 					fillBPAry.push("UPGRADE_ELEMENT eq '"+tempArray[q]+"' or ");
		// 				}

		// 			}
		// 			tmpStrg = JSON.stringify(fillBPAry);
		// 			_temp1 = (tmpStrg.split("[")[1]).split("]")[0];
		// 			_temp2 = _temp1.replace(/"/g,"");
		// 			fillBP = _temp2.replace(/,/g,"");
		// 		}

		// 	}

		// 	self.stat = true;
		// 	self.state = false;

		// 	if(self.stat==true){
		// 		var tempDateBtn = this.getView().byId("dateview").getSelectedButton().split("--")[1];
		// 		if(tempDateBtn=="btn1Month"){
		// 			var Datetoday = new Date();
		// 			var fromDate = new Date();
		// 			fromDate.setDate((fromDate.getDate() - 30) + 1);
		// 			// fromDate = fromDate.YYYYMMDD();

		// 			var fromCompDate = fromDate.toISOString();
		// 	    	var toCompDate = Datetoday.toISOString();
		// 		}else if(tempDateBtn=="btn3Month"){
		// 			var Datetoday = new Date();
		// 			var fromDate = new Date();
		// 			fromDate.setMonth((fromDate.getMonth() - 3));
		// 			fromDate.setDate(fromDate.getDate() + 1);

		// 	    	var fromCompDate = fromDate.toISOString();
		// 	    	var toCompDate = Datetoday.toISOString();
		// 		}
		// 		else if(tempDateBtn=="btn6Month"){
		// 			var Datetoday = new Date();
		// 			var fromDate = new Date();
		// 			fromDate.setMonth((fromDate.getMonth() - 6));
		// 			fromDate.setDate(fromDate.getDate() + 1);
		// 			// fromDate = fromDate.YYYYMMDD();

		// 			var fromCompDate = fromDate.toISOString();
		// 	    	var toCompDate = Datetoday.toISOString();
		// 		}
		// 		else if(tempDateBtn=="btn1Year"){
		// 			var Datetoday = new Date();
		// 			var fromDate = new Date();
		// 			fromDate.setMonth((fromDate.getMonth() - 12));
		// 			fromDate.setDate(fromDate.getDate() + 1);
		// 			// fromDate = fromDate.YYYYMMDD();

		// 			var fromCompDate = fromDate.toISOString();
		// 	    	var toCompDate = Datetoday.toISOString();
		// 		}else if(tempDateBtn=="btn2Year"){
		// 			var Datetoday = new Date();
		// 			var fromDate = new Date();
		// 			fromDate.setMonth((fromDate.getMonth() - 24));
		// 			fromDate.setDate(fromDate.getDate() + 1);
		// 			// fromDate = fromDate.YYYYMMDD();

		// 			var fromCompDate = fromDate.toISOString();
		// 	    	var toCompDate = Datetoday.toISOString();
		// 		}
		// 	}else{
		// 		var fromDateVal = this.getView().byId("dateviewrange").getDateValue();
		// 		var toDateVal = this.getView().byId("dateviewrange").getSecondDateValue();

		// 		var fromCompDate = fromDateVal.toISOString();
		//     	var toCompDate = toDateVal.toISOString();
		// 	}

		// 	var mdl = this.getView().getModel();

		// 	var groups = this.getView().byId("ddlVersion").getValue();
		// 	if (groups == "") {
		// 		this.getView().byId("ddlVersion").setValue("Build Version");
		// 		this.getView().byId("ddlVersion").setSelectedKey("Build Version");
		// 	}
		// 	var tempKey = this.getView().byId("ddlVersion").getSelectedKey();
		// 	if (tempKey == "Version") {
		// 		tempKey = "";
		// 	}

		// 	this.CallCustomerData(mdl, tempKey, fromCompDate,toCompDate,fillBP);

		// },
		createColumnConfig: function() {
			var aCols = [];

			// aCols.push({
			// 	label: 'ID',
			// 	type: 'number',
			// 	property: 'UserID',
			// 	scale: 0
			// });
			
			var modelAdmin = sap.ui.getCore().getModel("superadmin").getData();
			if (modelAdmin=="superadmin") {
				aCols.push({
					property: 'val',
					label: 'Company Name',
					type: 'string',
					width: '30'
				});
			}else{
				aCols.push({
					property: 'Default',
					label: 'Company Name',
					type: 'string',
					width: '30'
				});
			}
			

			// aCols.push({
			// 	property: 'val',
			// 	label: 'Company Name',
			// 	type: 'string',
			// 	width: '30'
			// });

			aCols.push({
				property: 'upgradeString',
				label: 'Upgrade Actions',
				type: 'string',
				width: '30'
			});

			aCols.push({
				label: 'Time Stamp (Last Run)',
				property: 'time',
				type: 'string'
			});

			return aCols;
		},

		testEmail: function() {

			if (!this._oTable) {
				this._oTable = this.byId("listTable");
			}

			var oRowBinding = this._oTable.getBinding("items");

			var oModel = oRowBinding.getModel();
			// var oModelInterface = oModel.getInterface();

			var aProducts = oModel.getProperty("/stlistUser");

			var oMail = {
				MailFrom: {
					address: "successfactorshcm@sap.com"
				},
				MailTo: [{
					address: "ankit.vashisht@sap.com"
				}],
				Subject: "test",
				MailBody: aProducts
			};
				
		
		},
		onExport: function() {
			var me = this;
			var aCols, aProducts, oSettings, oRowBinding;

			if (!this._oTable) {
				this._oTable = this.byId("listTable");
			}

			oRowBinding = this._oTable.getBinding("items");

			var oModel = oRowBinding.getModel();
			// var oModelInterface = oModel.getInterface();

			aCols = this.createColumnConfig();
			aProducts = oModel.getProperty("/stlistUser");

			oSettings = {
				workbook: {
					columns: aCols
				},
				dataSource: aProducts,
				fileName: "Customer List.xlsx",
				showProgress: false
			};

			var spreadsheet = new Spreadsheet(oSettings)
				.build()
				.then(function() {
					new sap.m.MessageToast.show("Customer List export has finished");

				});

			//me.testEmail();

			// var aBoundProperties, aCols, oProperties, oRowBinding, oSettings, oTable, oController;

			// oController = this;

			// if (!this._oTable) {
			// 	this._oTable = this.byId("listTable");
			// }

			// oTable = this._oTable;
			// oRowBinding = oTable.getBinding("items");

			// aCols = this.createColumnConfig();

			// var oModel = oRowBinding.getModel();
			// var oModelInterface = oModel.getInterface();

			// oSettings = {
			// 	workbook: { columns: aCols },
			// 	dataSource: {
			// 		type: "oData",
			// 		dataUrl: oRowBinding.getDownloadUrl ? oRowBinding.getDownloadUrl() : null,
			// 		serviceUrl: oModelInterface.sServiceUrl,
			// 		headers: oModelInterface.getHeaders ? oModelInterface.getHeaders() : null,
			// 		count: oRowBinding.getLength ? oRowBinding.getLength() : null,
			// 		useBatch: oModelInterface.bUseBatch,
			// 		sizeLimit: oModelInterface.iSizeLimit
			// 	},
			// 	worker: false // We need to disable worker because we are using a MockServer as OData Service
			// };

			// new Spreadsheet(oSettings).build();
		},

		onDataExport: sap.m.Table.prototype.exportData || function(oEvent) {

			var oExport = new Export({

				// Type that will be used to generate the content. Own ExportType's can be created to support other formats
				exportType: new ExportTypeCSV({
					separatorChar: ";"
				}),

				// Pass in the model created above
				models: this.getView().getModel(),

				// binding information for the rows aggregation
				rows: {
					path: "/ProductCollection"
				},

				// column definitions with column name and binding info for the content

				columns: [{
					name: "Product",
					template: {
						content: "{Name}"
					}
				}, {
					name: "Product ID",
					template: {
						content: "{ProductId}"
					}
				}, {
					name: "Supplier",
					template: {
						content: "{SupplierName}"
					}
				}, {
					name: "Dimensions",
					template: {
						content: {
							parts: ["Width", "Depth", "Height", "DimUnit"],
							formatter: function(width, depth, height, dimUnit) {
								return width + " x " + depth + " x " + height + " " + dimUnit;
							},
							state: "Warning"
						}
						// "{Width} x {Depth} x {Height} {DimUnit}"
					}
				}, {
					name: "Weight",
					template: {
						content: "{WeightMeasure} {WeightUnit}"
					}
				}, {
					name: "Price",
					template: {
						content: "{Price} {CurrencyCode}"
					}
				}]
			});

			// download exported file
			oExport.saveFile().catch(function(oError) {
				new sap.m.MessageBox.error("Error when downloading data. Browser might not be supported!\n\n" + oError);
			}).then(function() {
				oExport.destroy();
			});

		},
		ddlUpgradeChanged: function() {
			// add filter for search
			var aFilters = [];
			// var sQuery = oEvt.getSource().getValue();
			// if (sQuery && sQuery.length > 0) {
			// var filter = new sap.ui.model.Filter("val", sap.ui.model.FilterOperator.Contains, sQuery);
			// aFilters.push(filter);
			// }
			// var filter = "";
			var upgrade = this.getView().byId("ddlUpgrade").getSelectedKey();
			var tempBrown = window.globalTempBrown;
			var tempGreen = window.globalTempGreen;

			if (upgrade == "GF") {
				for (var t = 0; t < tempGreen.length; t++) {
					for (var q = 0; q < tempGreen[t].cmpny.length; q++) {
						var filter = new sap.ui.model.Filter("val", sap.ui.model.FilterOperator.Contains, tempGreen[t].cmpny[q]);
						aFilters.push(filter);
					}
				}
			} else if (upgrade == "BF") {
				for (var t = 0; t < tempBrown.length; t++) {
					for (var q = 0; q < tempBrown[t].cmpny.length; q++) {
						var filter = new sap.ui.model.Filter("val", sap.ui.model.FilterOperator.Contains, tempBrown[t].cmpny[q]);
						aFilters.push(filter);
					}
				}
			} else {
				// var filter = "";
				// aFilters.push(filter);
			}

			// update list binding
			var list = this.getView().byId("listTable");
			var binding = list.getBinding("items");
			binding.filter(aFilters, "Application");

		},
		UpdateGUIGraphsdate: function(oEvent) {
			var self = this;
			self.stat = true;
			self.state = false;
			var tempDateBtn = (oEvent.getParameters().id).split("--")[1];
			// var tempDateBtn = this.getView().byId("dateview").getSelectedButton().split("--")[1];
			if (tempDateBtn == "btn1Day") {
				
				var Datetoday = new Date();
				var toDate = new Date();
				toDate = toDate.YYYYMMDD();

				var fromDate = new Date();
				fromDate.setDate((fromDate.getDate() - 1) );
				// if(fromDate.getDate()!=1){
				// 	fromDate.setDate(1);
				// }
				var fromDateDay = fromDate.YYYYMMDD();

				var fromCompDate = fromDate.toISOString();
				var toCompDateTemp = Datetoday.toISOString();
			} else if (tempDateBtn == "btn1Month") {
				var Datetoday = new Date();
				var toDate = new Date();
				toDate = toDate.YYYYMMDD();

				var fromDate = new Date();
				fromDate.setDate((fromDate.getDate() - 30) + 1);
				
				// if(fromDate.getDate()!=1){
				// 	fromDate.setDate(1);
				// }
			
				var fromDateDay = fromDate.YYYYMMDD();

				var fromCompDate = fromDate.toISOString();
				var toCompDateTemp = Datetoday.toISOString();
			} else if (tempDateBtn == "btn3Month") {
				var Datetoday = new Date();
				var toDate = new Date();
				toDate = toDate.YYYYMMDD();

				var fromDate = new Date();
				fromDate.setMonth((fromDate.getMonth() - 3));
				fromDate.setDate(fromDate.getDate() + 1);
				
				// if(fromDate.getDate()!=1){
				// 	fromDate.setDate(1);
				// }
				
				var fromDateDay = fromDate.YYYYMMDD();

				var fromCompDate = fromDate.toISOString();
				var toCompDateTemp = Datetoday.toISOString();
			} else if (tempDateBtn == "btn6Month") {
				var Datetoday = new Date();
				var toDate = new Date();
				toDate = toDate.YYYYMMDD();

				var fromDate = new Date();
				fromDate.setMonth((fromDate.getMonth() - 6));
				fromDate.setDate(fromDate.getDate() + 1);
				
				// if(fromDate.getDate()!=1){
				// 	fromDate.setDate(1);
				// }
				
				var fromDateDay = fromDate.YYYYMMDD();

				var fromCompDate = fromDate.toISOString();
				var toCompDateTemp = Datetoday.toISOString();
			} else if (tempDateBtn == "btn1Year") {
				var Datetoday = new Date();
				var toDate = new Date();
				toDate = toDate.YYYYMMDD();

				var fromDate = new Date();
				fromDate.setMonth((fromDate.getMonth() - 12));
				fromDate.setDate(fromDate.getDate() + 1);
				
				// if(fromDate.getDate()!=1){
				// 	fromDate.setDate(1);
				// }
				
				var fromDateDay = fromDate.YYYYMMDD();

				var fromCompDate = fromDate.toISOString();
				var toCompDateTemp = Datetoday.toISOString();
			} else if (tempDateBtn == "btn2Year") {
				var Datetoday = new Date();
				var toDate = new Date();
				toDate = toDate.YYYYMMDD();

				var fromDate = new Date();
				fromDate.setMonth((fromDate.getMonth() - 24));
				fromDate.setDate(fromDate.getDate() + 1);
				
				// if(fromDate.getDate()!=1){
				// 	fromDate.setDate(1);
				// }
				
				var fromDateDay = fromDate.YYYYMMDD();

				var fromCompDate = fromDate.toISOString();
				var toCompDateTemp = Datetoday.toISOString();
			}
			this.getView().byId("dateviewrange").setDateValue(stringToDate(fromDateDay));
			this.getView().byId("dateviewrange").setSecondDateValue(stringToDate(toDate));

			var mdl = this.getView().getModel();
			var tempKey = this.getView().byId("ddlVersion").getSelectedKey();
			if (tempKey == "Version") {
				tempKey = "";
			}

			// this.getView().byId("ddlUpgrade").setSelectedKey("All");
			// this.ddlUpgradeChanged();
			this.getView().byId("filterLabel").setText("All Customers");
			this.getView().byId("cancelBtn").setVisible(false);
			this.getView().byId("searchfield").setValue("");

			fromCompDate = fromCompDate.split("T")[0] + "T00:00";
			toCompDateTemp = toCompDateTemp.split("T")[0] + "T24:00";
			var tempDateTo = (new Date(toCompDateTemp)).getDate();
			var d = new Date(toCompDateTemp);
			d.setDate(tempDateTo);
			var toCompDate = d.toISOString();
			toCompDate = toCompDate.split("T")[0] + "T24:00";

this.showBusyIndicator(10000, 0);
this.loadKPINumbers(mdl, tempKey, fromCompDate, toCompDate);
			// this.loadChartBottom(mdl, tempKey, fromCompDate,toCompDate);
			this.loadLineChartBottom(mdl, tempKey, fromCompDate, toCompDate);
			this.loadLineChart(mdl, tempKey, fromCompDate, toCompDate);
			
			this.CallCustomerData(mdl, tempKey, fromCompDate, toCompDate, "");

		},

		UpdateDateRange: function(oEvent) {
			var self = this;
			self.stat = false;
			self.state = true;

			this.getView().byId("dateview").setSelectedButton("0");
			// var d = this.getView().byId("dateview").getSelectedButton();
			var fromDateVal = this.getView().byId("dateviewrange").getDateValue();
			var fromDate = fromDateVal.YYYYMMDD();
			var toDateVal = this.getView().byId("dateviewrange").getSecondDateValue();
			var toDate = toDateVal.YYYYMMDD();
			var tempDateToday = new Date();
			var tempDateToday = tempDateToday.YYYYMMDD();
			if (fromDate > tempDateToday) {
				oEvent.oSource.setValueState(sap.ui.core.ValueState.Error);
			} else if (toDate > tempDateToday) {
				oEvent.oSource.setValueState(sap.ui.core.ValueState.Error);
			} else {
				oEvent.oSource.setValueState(sap.ui.core.ValueState.None);
			}

			this.getView().byId("dateviewrange").setDateValue(stringToDate(fromDate));
			this.getView().byId("dateviewrange").setSecondDateValue(stringToDate(toDate));

			var fromCompDate = fromDateVal.toISOString();
			
			// var tempDateFrom = (new Date(fromCompDate)).getDate() + 1;
			// var dF = new Date(fromCompDate);
			// dF.setDate(tempDateFrom);
			// var fromCompDate = dF.toISOString();
			
			
			var toCompDateTemp = toDateVal.toISOString();
			fromCompDate = fromCompDate.split("T")[0] + "T00:00";
			// toCompDateTemp = toCompDateTemp.split("T")[0] + "T24:00";
			var tempDateTo = (new Date(toCompDateTemp)).getDate();
			var d = new Date(toCompDateTemp);
			d.setDate(tempDateTo);
			var toCompDate = d.toISOString();
			toCompDate = toCompDate.split("T")[0] + "T24:00";

			var mdl = this.getView().getModel();
			var tempKey = this.getView().byId("ddlVersion").getSelectedKey();
			if (tempKey == "Version") {
				tempKey = "";
			}

			// this.getView().byId("ddlUpgrade").setSelectedKey("All");
			// this.ddlUpgradeChanged();
			this.getView().byId("filterLabel").setText("All Customers");
			this.getView().byId("cancelBtn").setVisible(false);
			this.getView().byId("searchfield").setValue("");

this.showBusyIndicator(10000, 0);
this.loadKPINumbers(mdl, tempKey, fromCompDate, toCompDate);
			// this.loadChartBottom(mdl, tempKey, fromCompDate,toCompDate);
			this.loadLineChartBottom(mdl, tempKey, fromCompDate, toCompDate);
			this.loadLineChart(mdl, tempKey, fromCompDate, toCompDate);
			
			this.CallCustomerData(mdl, tempKey, fromCompDate, toCompDate, "");

		},

		loadDDlVersion: function(mdl) {

			var me = this;
			var url =
				"/UpgradeCenterResult?$select=COMPANYSCHEMA,COMPANY,TIME_STAMP,FILEVERSION&$orderby=TIME_STAMP desc&$filter=(substringof('sfv4',COMPANYSCHEMA) or substringof('SFV4',COMPANYSCHEMA) or substringof('STOCKPM',COMPANYSCHEMA) or substringof('GLOBUSER_DVLHCM20S',COMPANYSCHEMA) or substringof('globuser_dvlhcm20s',COMPANYSCHEMA) or substringof('stockpm',COMPANYSCHEMA) or substringof('GLOBUSER_DVLHCM20S',COMPANYSCHEMA) or substringof('globuser_dvlhcm20s',COMPANYSCHEMA) or substringof('STOCKPM000110_REF2',COMPANYSCHEMA) or substringof('stockpm000110_ref2',COMPANYSCHEMA) or substringof('STOCKPM172200_REF2',COMPANYSCHEMA) or substringof('stockpm172200_ref2',COMPANYSCHEMA) or substringof('STOCKPM170737_REF',COMPANYSCHEMA) or substringof('stockpm170737_ref',COMPANYSCHEMA) or substringof('DC',COMPANYSCHEMA) or substringof('dc',COMPANYSCHEMA) or substringof('STG',COMPANYSCHEMA) or substringof('stg',COMPANYSCHEMA) or substringof('HANAPM',COMPANYSCHEMA) or substringof('hanapm',COMPANYSCHEMA)) and COMPANYID ne 'PAYNGPPRL' and COMPANYID ne 'USBASEIAS22V1' and COMPANYID ne 'SAPSDCHXM0001' and COMPANYID ne 'PAYNGPPRLE' and COMPANYSCHEMA ne '' and COMPANY ne '' and COMPANY ne 'SAP SF Cloud Engineering'";

			// mdl.read(
			// 	url,
			// 	null, null, true,
			// 	function(oData, oResponse) {
			// 		if (oData.results.length > 0) {

			// 			var oModelVersion = new sap.ui.model.json.JSONModel();
			// 			oModelVersion.setSizeLimit(1000);
			// 			sap.ui.getCore().setModel(oModelVersion, "oModelVersion");

			// 			var tempData = [];
			// 			for (var q = 0; q < oData.results.length; q++) {
			// 				// if(oData.results[q].COMPANY=="CRUZ ROJA ESPAÑOLA"){
			// 				// 	oData.results[q].COMPANY="CRUZ ROJA ESPAÑOLA DESARROLLO";
			// 				// }
			// 				// if(oData.results[q].COMPANY=="Release"){
			// 				// 	oData.results[q].COMPANY="Stericycle Inc (de)";
			// 				// }
			// 				if(oData.results[q].COMPANY!="BPMCINSTANCE4" && oData.results[q].COMPANY!="BPMCINSTANCE1"){
			// 					if (oData.results[q].COMPANYSCHEMA != null && oData.results[q].COMPANYSCHEMA.toLowerCase().indexOf("sfsales")==-1) {
									
			// 					// if (oData.results[q].COMPANYSCHEMA.toLowerCase().indexOf("sfv4") > -1 || oData.results[q].COMPANYSCHEMA.toLowerCase().indexOf("hanapm") > -1 ||
			// 					// oData.results[q].COMPANYSCHEMA.toLowerCase().indexOf("stg") > -1 || oData.results[q].COMPANYSCHEMA.toLowerCase().indexOf("stockpm172200_ref2") > -1 ||  oData.results[q].COMPANYSCHEMA.toLowerCase().indexOf("dc") > -1) {
			// 						// if (oData.results[q].COMPANY.toLowerCase().indexOf("test") === -1 && oData.results[q].COMPANY.toLowerCase().indexOf("demo") ===	-1) {
			// 						if (oData.results[q].FILEVERSION != "") {
			// 							if (oData.results[q].FILEVERSION != null) {
			// 								tempData.push({
			// 									version: oData.results[q].FILEVERSION.split("b")[1].split("/")[0],
			// 									versionPara: oData.results[q].FILEVERSION
			// 								});
			// 							}
			// 						}
			// 					// }
			// 				}
			// 				}
			// 			}

			// 			var uniqueVersion = tempData.reduce(function(item, e1) {
			// 				var matches = item.filter(function(e2) {
			// 					return e1.version == e2.version;
			// 				});
			// 				if (matches.length == 0) {
			// 					item.push(e1);
			// 				}
			// 				return item;
			// 			}, []);
						
			// 			uniqueVersion.sort(function(a, b) {
			// 				return (a.version > b.version) ? 1 : ((b.version > a.version) ? -1 : 0);
			// 			});
			// 			uniqueVersion = uniqueVersion.reverse();
						
			// 			uniqueVersion.unshift({
			// 				version: "Build Version",
			// 				versionPara: "Version"
			// 			});

			// 			var oDataGrp = {
			// 				"stlist": uniqueVersion
			// 			};

			// 			oModelVersion.setData(oDataGrp);
			// 			me.getView().byId("ddlVersion").setModel(oModelVersion);

			// 		}
			// 		else{
			// 			var oModelVersion = new sap.ui.model.json.JSONModel();
			// 			oModelVersion.setSizeLimit(1000);
			// 			sap.ui.getCore().setModel(oModelVersion, "oModelVersion");

			// 			var oDataGrp = {
			// 				"stlist": []
			// 			};

			// 			oModelVersion.setData(oDataGrp);
			// 			me.getView().byId("ddlVersion").setModel(oModelVersion);
			// 		}
			// 	},
			// 	function(oError) {
			// 		console.log("Error 127");
			// 	});
var oModelVersion = new sap.ui.model.json.JSONModel();
						oModelVersion.setSizeLimit(1000);
						sap.ui.getCore().setModel(oModelVersion, "oModelVersion");
						var uniqueVersion = [{
							version: "Build Version",
							versionPara: "Version"
						},{
							version: "2111",
							versionPara: "b2111/"
						},{
							version: "2105",
							versionPara: "b2105/"
						},{
							version: "2011",
							versionPara: "b2011/"
						},{
							version: "2005",
							versionPara: "b2005/"
						},{
							version: "1911",
							versionPara: "b1911"
						},{
							version: "1908",
							versionPara: "b1908/"
						},{
							version: "1905",
							versionPara: "b1905/"
						},{
							version: "1902",
							versionPara: "b1902/"
						},{
							version: "1811",
							versionPara: "b1811/"
						},{
							version: "1808",
							versionPara: "b1808/"
						},{
							version: "1805",
							versionPara: "b1805/"
						},{
							version: "1802",
							versionPara: "b1802/"
						},{
							version: "1711",
							versionPara: "b1711/"
						},{
							version: "1708",
							versionPara: "b1708/"
						},{
							version: "1705",
							versionPara: "b1705/"
						}];
						

						var oDataGrp = {
							"stlist": uniqueVersion
						};

						oModelVersion.setData(oDataGrp);
						me.getView().byId("ddlVersion").setModel(oModelVersion);
		},
		
		CallCustomerData: function(mdl, para, fromCompDate, toCompDate, fillBP) {
			var tempTestAry = [];
			var me = this;
			var tempODATAPreCheck = [];
			var tempODATAPreCheckFilter = [];
			// var oModelUpgradeRecruitData = sap.ui.getCore().getModel("oModelUpgradeRecruit").getData();
			var deployKey = me.getView().byId("ddlDeploy").getSelectedKey();
			
			
			var datatempoModelUpgradeRecruitON = sap.ui.getCore().getModel("oModelUpgradeRecruitON").getData();
			var datatempoModelUpgradeRecruitREC = sap.ui.getCore().getModel("oModelUpgradeRecruitREC").getData();
			var datatempoModelUpgradeRecruitSM = sap.ui.getCore().getModel("oModelUpgradeRecruitSM").getData();
			var datatempoModelUpgradeRecruitPG = sap.ui.getCore().getModel("oModelUpgradeRecruitPG").getData();
			var datatempoModelUpgradeRecruitCO = sap.ui.getCore().getModel("oModelUpgradeRecruitCO").getData();
			var datatempoModelUpgradeRecruitEC = sap.ui.getCore().getModel("oModelUpgradeRecruitEC").getData();
			

			if (fillBP == "") {
				if (para != "") {
					if(deployKey=="All"){
				var url =
						"/UpgradeCenterResult?$select=UPGRADE_ELEMENT,RESULT,COMPANYSCHEMA,COMPANY,TIME_STAMP&$orderby=TIME_STAMP desc&$filter=(substringof('sfv4',COMPANYSCHEMA) or substringof('SFV4',COMPANYSCHEMA) or substringof('STOCKPM',COMPANYSCHEMA) or substringof('GLOBUSER_DVLHCM20S',COMPANYSCHEMA) or substringof('globuser_dvlhcm20s',COMPANYSCHEMA) or substringof('stockpm',COMPANYSCHEMA) or substringof('GLOBUSER_DVLHCM20S',COMPANYSCHEMA) or substringof('globuser_dvlhcm20s',COMPANYSCHEMA) or substringof('STOCKPM000110_REF2',COMPANYSCHEMA) or substringof('stockpm000110_ref2',COMPANYSCHEMA) or substringof('STOCKPM172200_REF2',COMPANYSCHEMA) or substringof('stockpm172200_ref2',COMPANYSCHEMA) or substringof('STOCKPM170737_REF',COMPANYSCHEMA) or substringof('stockpm170737_ref',COMPANYSCHEMA)    or substringof('DC',COMPANYSCHEMA) or substringof('dc',COMPANYSCHEMA) or substringof('STG',COMPANYSCHEMA) or substringof('stg',COMPANYSCHEMA) or substringof('HANAPM',COMPANYSCHEMA) or substringof('hanapm',COMPANYSCHEMA)) and COMPANYID ne 'PAYNGPPRL' and COMPANYID ne 'USBASEIAS22V1' and COMPANYID ne 'SAPSDCHXM0001' and COMPANYID ne 'PAYNGPPRLE' and COMPANYSCHEMA ne '' and COMPANY ne '' and COMPANY ne 'SAP SF Cloud Engineering' and FILEVERSION eq '" +
						para + "' and TIME_STAMP ge datetime'" + fromCompDate + "' and TIME_STAMP le datetime'" + toCompDate + "'";
					}else if(deployKey=="CUST"){
						var url =
						"/UpgradeCenterResult?$select=UPGRADE_ELEMENT,RESULT,COMPANYSCHEMA,COMPANY,TIME_STAMP&$orderby=TIME_STAMP desc&$filter=(substringof('sfv4',COMPANYSCHEMA) or substringof('SFV4',COMPANYSCHEMA) or substringof('STOCKPM',COMPANYSCHEMA) or substringof('GLOBUSER_DVLHCM20S',COMPANYSCHEMA) or substringof('globuser_dvlhcm20s',COMPANYSCHEMA) or substringof('stockpm',COMPANYSCHEMA) or substringof('GLOBUSER_DVLHCM20S',COMPANYSCHEMA) or substringof('globuser_dvlhcm20s',COMPANYSCHEMA) or substringof('STOCKPM000110_REF2',COMPANYSCHEMA) or substringof('stockpm000110_ref2',COMPANYSCHEMA) or substringof('STOCKPM172200_REF2',COMPANYSCHEMA) or substringof('stockpm172200_ref2',COMPANYSCHEMA) or substringof('STOCKPM170737_REF',COMPANYSCHEMA) or substringof('stockpm170737_ref',COMPANYSCHEMA)    or substringof('DC',COMPANYSCHEMA) or substringof('dc',COMPANYSCHEMA) or substringof('STG',COMPANYSCHEMA) or substringof('stg',COMPANYSCHEMA) or substringof('HANAPM',COMPANYSCHEMA) or substringof('hanapm',COMPANYSCHEMA)) and substringof('_',UPGRADE_ELEMENT) and COMPANYID ne 'PAYNGPPRL' and COMPANYID ne 'USBASEIAS22V1' and COMPANYID ne 'SAPSDCHXM0001' and COMPANYID ne 'PAYNGPPRLE' and COMPANYSCHEMA ne '' and COMPANY ne '' and COMPANY ne 'SAP SF Cloud Engineering' and FILEVERSION eq '" +
						para + "' and TIME_STAMP ge datetime'" + fromCompDate + "' and TIME_STAMP le datetime'" + toCompDate + "'";
					}else{
					var url =
						"/UpgradeCenterResult?$select=UPGRADE_ELEMENT,RESULT,COMPANYSCHEMA,COMPANY,TIME_STAMP&$orderby=TIME_STAMP desc&$filter=(substringof('sfv4',COMPANYSCHEMA) or substringof('SFV4',COMPANYSCHEMA) or substringof('STOCKPM',COMPANYSCHEMA) or substringof('GLOBUSER_DVLHCM20S',COMPANYSCHEMA) or substringof('globuser_dvlhcm20s',COMPANYSCHEMA) or substringof('stockpm',COMPANYSCHEMA) or substringof('GLOBUSER_DVLHCM20S',COMPANYSCHEMA) or substringof('globuser_dvlhcm20s',COMPANYSCHEMA) or substringof('STOCKPM000110_REF2',COMPANYSCHEMA) or substringof('stockpm000110_ref2',COMPANYSCHEMA) or substringof('STOCKPM172200_REF2',COMPANYSCHEMA) or substringof('stockpm172200_ref2',COMPANYSCHEMA) or substringof('STOCKPM170737_REF',COMPANYSCHEMA) or substringof('stockpm170737_ref',COMPANYSCHEMA)    or substringof('DC',COMPANYSCHEMA) or substringof('dc',COMPANYSCHEMA) or substringof('STG',COMPANYSCHEMA) or substringof('stg',COMPANYSCHEMA) or substringof('HANAPM',COMPANYSCHEMA) or substringof('hanapm',COMPANYSCHEMA)) and indexof(UPGRADE_ELEMENT,'_') eq -1  and COMPANYID ne 'PAYNGPPRL' and COMPANYID ne 'USBASEIAS22V1' and COMPANYID ne 'SAPSDCHXM0001' and COMPANYID ne 'PAYNGPPRLE' and COMPANYSCHEMA ne '' and COMPANY ne '' and COMPANY ne 'SAP SF Cloud Engineering' and FILEVERSION eq '" +
						para + "' and TIME_STAMP ge datetime'" + fromCompDate + "' and TIME_STAMP le datetime'" + toCompDate + "'";	
					}
					// var url =
					// 	"/UpgradeCenterResult?$select=UPGRADE_ELEMENT,RESULT,COMPANYSCHEMA,COMPANY,TIME_STAMP&$orderby=TIME_STAMP desc&$filter=(substringof('sfv4',COMPANYSCHEMA) or substringof('SFV4',COMPANYSCHEMA) or substringof('stockpm',COMPANYSCHEMA) or substringof('GLOBUSER_DVLHCM20S',COMPANYSCHEMA) or substringof('globuser_dvlhcm20s',COMPANYSCHEMA) or substringof('stockpm',COMPANYSCHEMA) or substringof('GLOBUSER_DVLHCM20S',COMPANYSCHEMA) or substringof('globuser_dvlhcm20s',COMPANYSCHEMA) or substringof('STOCKPM000110_REF2',COMPANYSCHEMA) or substringof('stockpm000110_ref2',COMPANYSCHEMA) or substringof('STOCKPM172200_REF2',COMPANYSCHEMA) or substringof('stockpm172200_ref2',COMPANYSCHEMA) or substringof('STOCKPM170737_REF',COMPANYSCHEMA) or substringof('stockpm170737_ref',COMPANYSCHEMA)    or substringof('DC',COMPANYSCHEMA) or substringof('dc',COMPANYSCHEMA) or substringof('STG',COMPANYSCHEMA) or substringof('stg',COMPANYSCHEMA) or substringof('HANAPM',COMPANYSCHEMA) or substringof('hanapm',COMPANYSCHEMA)) and COMPANYID ne 'PAYNGPPRL' and COMPANYID ne 'USBASEIAS22V1' and COMPANYID ne 'SAPSDCHXM0001' and COMPANYID ne 'PAYNGPPRLE' and COMPANYSCHEMA ne '' and COMPANY ne '' and COMPANY ne 'SAP SF Cloud Engineering' and FILEVERSION eq '" +
					// 	para + "' and TIME_STAMP ge datetime'" + fromCompDate + "' and TIME_STAMP le datetime'" + toCompDate + "'";
				
				} else {
					if(deployKey=="All"){
				var url =
						"/UpgradeCenterResult?$select=UPGRADE_ELEMENT,RESULT,COMPANYSCHEMA,COMPANY,TIME_STAMP&$orderby=TIME_STAMP desc&$filter=(substringof('sfv4',COMPANYSCHEMA) or substringof('SFV4',COMPANYSCHEMA) or substringof('STOCKPM',COMPANYSCHEMA) or substringof('GLOBUSER_DVLHCM20S',COMPANYSCHEMA) or substringof('globuser_dvlhcm20s',COMPANYSCHEMA) or substringof('stockpm',COMPANYSCHEMA) or substringof('GLOBUSER_DVLHCM20S',COMPANYSCHEMA) or substringof('globuser_dvlhcm20s',COMPANYSCHEMA) or substringof('STOCKPM000110_REF2',COMPANYSCHEMA) or substringof('stockpm000110_ref2',COMPANYSCHEMA) or substringof('STOCKPM172200_REF2',COMPANYSCHEMA) or substringof('stockpm172200_ref2',COMPANYSCHEMA) or substringof('STOCKPM170737_REF',COMPANYSCHEMA) or substringof('stockpm170737_ref',COMPANYSCHEMA)    or substringof('DC',COMPANYSCHEMA) or substringof('dc',COMPANYSCHEMA) or substringof('STG',COMPANYSCHEMA) or substringof('stg',COMPANYSCHEMA) or substringof('HANAPM',COMPANYSCHEMA) or substringof('hanapm',COMPANYSCHEMA)) and COMPANYID ne 'PAYNGPPRL' and COMPANYID ne 'USBASEIAS22V1' and COMPANYID ne 'SAPSDCHXM0001' and COMPANYID ne 'PAYNGPPRLE' and COMPANYSCHEMA ne '' and COMPANY ne '' and COMPANY ne 'SAP SF Cloud Engineering' and TIME_STAMP ge datetime'" +
						fromCompDate + "' and TIME_STAMP le datetime'" + toCompDate + "'";
					}else if(deployKey=="CUST"){
						var url =
						"/UpgradeCenterResult?$select=UPGRADE_ELEMENT,RESULT,COMPANYSCHEMA,COMPANY,TIME_STAMP&$orderby=TIME_STAMP desc&$filter=(substringof('sfv4',COMPANYSCHEMA) or substringof('SFV4',COMPANYSCHEMA) or substringof('STOCKPM',COMPANYSCHEMA) or substringof('GLOBUSER_DVLHCM20S',COMPANYSCHEMA) or substringof('globuser_dvlhcm20s',COMPANYSCHEMA) or substringof('stockpm',COMPANYSCHEMA) or substringof('GLOBUSER_DVLHCM20S',COMPANYSCHEMA) or substringof('globuser_dvlhcm20s',COMPANYSCHEMA) or substringof('STOCKPM000110_REF2',COMPANYSCHEMA) or substringof('stockpm000110_ref2',COMPANYSCHEMA) or substringof('STOCKPM172200_REF2',COMPANYSCHEMA) or substringof('stockpm172200_ref2',COMPANYSCHEMA) or substringof('STOCKPM170737_REF',COMPANYSCHEMA) or substringof('stockpm170737_ref',COMPANYSCHEMA)    or substringof('DC',COMPANYSCHEMA) or substringof('dc',COMPANYSCHEMA) or substringof('STG',COMPANYSCHEMA) or substringof('stg',COMPANYSCHEMA) or substringof('HANAPM',COMPANYSCHEMA) or substringof('hanapm',COMPANYSCHEMA)) and substringof('_',UPGRADE_ELEMENT) and COMPANYID ne 'PAYNGPPRL' and COMPANYID ne 'USBASEIAS22V1' and COMPANYID ne 'SAPSDCHXM0001' and COMPANYID ne 'PAYNGPPRLE' and COMPANYSCHEMA ne '' and COMPANY ne '' and COMPANY ne 'SAP SF Cloud Engineering' and TIME_STAMP ge datetime'" +
						fromCompDate + "' and TIME_STAMP le datetime'" + toCompDate + "'";
					}else{
						var url =
						"/UpgradeCenterResult?$select=UPGRADE_ELEMENT,RESULT,COMPANYSCHEMA,COMPANY,TIME_STAMP&$orderby=TIME_STAMP desc&$filter=(substringof('sfv4',COMPANYSCHEMA) or substringof('SFV4',COMPANYSCHEMA) or substringof('STOCKPM',COMPANYSCHEMA) or substringof('GLOBUSER_DVLHCM20S',COMPANYSCHEMA) or substringof('globuser_dvlhcm20s',COMPANYSCHEMA) or substringof('stockpm',COMPANYSCHEMA) or substringof('GLOBUSER_DVLHCM20S',COMPANYSCHEMA) or substringof('globuser_dvlhcm20s',COMPANYSCHEMA) or substringof('STOCKPM000110_REF2',COMPANYSCHEMA) or substringof('stockpm000110_ref2',COMPANYSCHEMA) or substringof('STOCKPM172200_REF2',COMPANYSCHEMA) or substringof('stockpm172200_ref2',COMPANYSCHEMA) or substringof('STOCKPM170737_REF',COMPANYSCHEMA) or substringof('stockpm170737_ref',COMPANYSCHEMA)    or substringof('DC',COMPANYSCHEMA) or substringof('dc',COMPANYSCHEMA) or substringof('STG',COMPANYSCHEMA) or substringof('stg',COMPANYSCHEMA) or substringof('HANAPM',COMPANYSCHEMA) or substringof('hanapm',COMPANYSCHEMA)) and indexof(UPGRADE_ELEMENT,'_') eq -1  and COMPANYID ne 'PAYNGPPRL' and COMPANYID ne 'USBASEIAS22V1' and COMPANYID ne 'SAPSDCHXM0001' and COMPANYID ne 'PAYNGPPRLE' and COMPANYSCHEMA ne '' and COMPANY ne '' and COMPANY ne 'SAP SF Cloud Engineering' and TIME_STAMP ge datetime'" +
						fromCompDate + "' and TIME_STAMP le datetime'" + toCompDate + "'";
					}
					// var url =
					// 	"/UpgradeCenterResult?$select=UPGRADE_ELEMENT,RESULT,COMPANYSCHEMA,COMPANY,TIME_STAMP&$orderby=TIME_STAMP desc&$filter=(substringof('sfv4',COMPANYSCHEMA) or substringof('SFV4',COMPANYSCHEMA) or substringof('stockpm',COMPANYSCHEMA) or substringof('GLOBUSER_DVLHCM20S',COMPANYSCHEMA) or substringof('globuser_dvlhcm20s',COMPANYSCHEMA) or substringof('stockpm',COMPANYSCHEMA) or substringof('GLOBUSER_DVLHCM20S',COMPANYSCHEMA) or substringof('globuser_dvlhcm20s',COMPANYSCHEMA) or substringof('STOCKPM000110_REF2',COMPANYSCHEMA) or substringof('stockpm000110_ref2',COMPANYSCHEMA) or substringof('STOCKPM172200_REF2',COMPANYSCHEMA) or substringof('stockpm172200_ref2',COMPANYSCHEMA) or substringof('STOCKPM170737_REF',COMPANYSCHEMA) or substringof('stockpm170737_ref',COMPANYSCHEMA)    or substringof('DC',COMPANYSCHEMA) or substringof('dc',COMPANYSCHEMA) or substringof('STG',COMPANYSCHEMA) or substringof('stg',COMPANYSCHEMA) or substringof('HANAPM',COMPANYSCHEMA) or substringof('hanapm',COMPANYSCHEMA)) and COMPANYID ne 'PAYNGPPRL' and COMPANYID ne 'USBASEIAS22V1' and COMPANYID ne 'SAPSDCHXM0001' and COMPANYID ne 'PAYNGPPRLE' and COMPANYSCHEMA ne '' and COMPANY ne '' and COMPANY ne 'SAP SF Cloud Engineering' and TIME_STAMP ge datetime'" +
					// 	fromCompDate + "' and TIME_STAMP le datetime'" + toCompDate + "'";
				}
			} else {
				if (para != "") {
					if(deployKey=="All"){
				var url =
						"/UpgradeCenterResult?$select=UPGRADE_ELEMENT,RESULT,COMPANYSCHEMA,COMPANY,TIME_STAMP&$orderby=TIME_STAMP desc&$filter=(substringof('sfv4',COMPANYSCHEMA) or substringof('SFV4',COMPANYSCHEMA) or substringof('STOCKPM',COMPANYSCHEMA) or substringof('GLOBUSER_DVLHCM20S',COMPANYSCHEMA) or substringof('globuser_dvlhcm20s',COMPANYSCHEMA) or substringof('stockpm',COMPANYSCHEMA) or substringof('GLOBUSER_DVLHCM20S',COMPANYSCHEMA) or substringof('globuser_dvlhcm20s',COMPANYSCHEMA) or substringof('STOCKPM000110_REF2',COMPANYSCHEMA) or substringof('stockpm000110_ref2',COMPANYSCHEMA) or substringof('STOCKPM172200_REF2',COMPANYSCHEMA) or substringof('stockpm172200_ref2',COMPANYSCHEMA) or substringof('STOCKPM170737_REF',COMPANYSCHEMA) or substringof('stockpm170737_ref',COMPANYSCHEMA)    or substringof('DC',COMPANYSCHEMA) or substringof('dc',COMPANYSCHEMA) or substringof('STG',COMPANYSCHEMA) or substringof('stg',COMPANYSCHEMA) or substringof('HANAPM',COMPANYSCHEMA) or substringof('hanapm',COMPANYSCHEMA)) and COMPANYID ne 'PAYNGPPRL' and COMPANYID ne 'USBASEIAS22V1' and COMPANYID ne 'SAPSDCHXM0001' and COMPANYID ne 'PAYNGPPRLE' and COMPANYSCHEMA ne '' and COMPANY ne '' and COMPANY ne 'SAP SF Cloud Engineering' and FILEVERSION eq '" +
						para + "' and TIME_STAMP ge datetime'" + fromCompDate + "' and TIME_STAMP le datetime'" + toCompDate + "' and " + fillBP;
					}else if(deployKey=="CUST"){
						var url =
						"/UpgradeCenterResult?$select=UPGRADE_ELEMENT,RESULT,COMPANYSCHEMA,COMPANY,TIME_STAMP&$orderby=TIME_STAMP desc&$filter=(substringof('sfv4',COMPANYSCHEMA) or substringof('SFV4',COMPANYSCHEMA) or substringof('STOCKPM',COMPANYSCHEMA) or substringof('GLOBUSER_DVLHCM20S',COMPANYSCHEMA) or substringof('globuser_dvlhcm20s',COMPANYSCHEMA) or substringof('stockpm',COMPANYSCHEMA) or substringof('GLOBUSER_DVLHCM20S',COMPANYSCHEMA) or substringof('globuser_dvlhcm20s',COMPANYSCHEMA) or substringof('STOCKPM000110_REF2',COMPANYSCHEMA) or substringof('stockpm000110_ref2',COMPANYSCHEMA) or substringof('STOCKPM172200_REF2',COMPANYSCHEMA) or substringof('stockpm172200_ref2',COMPANYSCHEMA) or substringof('STOCKPM170737_REF',COMPANYSCHEMA) or substringof('stockpm170737_ref',COMPANYSCHEMA)    or substringof('DC',COMPANYSCHEMA) or substringof('dc',COMPANYSCHEMA) or substringof('STG',COMPANYSCHEMA) or substringof('stg',COMPANYSCHEMA) or substringof('HANAPM',COMPANYSCHEMA) or substringof('hanapm',COMPANYSCHEMA)) and substringof('_',UPGRADE_ELEMENT) and COMPANYID ne 'PAYNGPPRL' and COMPANYID ne 'USBASEIAS22V1' and COMPANYID ne 'SAPSDCHXM0001' and COMPANYID ne 'PAYNGPPRLE' and COMPANYSCHEMA ne '' and COMPANY ne '' and COMPANY ne 'SAP SF Cloud Engineering' and FILEVERSION eq '" +
						para + "' and TIME_STAMP ge datetime'" + fromCompDate + "' and TIME_STAMP le datetime'" + toCompDate + "' and " + fillBP;
					}else{
					var url =
						"/UpgradeCenterResult?$select=UPGRADE_ELEMENT,RESULT,COMPANYSCHEMA,COMPANY,TIME_STAMP&$orderby=TIME_STAMP desc&$filter=(substringof('sfv4',COMPANYSCHEMA) or substringof('SFV4',COMPANYSCHEMA) or substringof('STOCKPM',COMPANYSCHEMA) or substringof('GLOBUSER_DVLHCM20S',COMPANYSCHEMA) or substringof('globuser_dvlhcm20s',COMPANYSCHEMA) or substringof('stockpm',COMPANYSCHEMA) or substringof('GLOBUSER_DVLHCM20S',COMPANYSCHEMA) or substringof('globuser_dvlhcm20s',COMPANYSCHEMA) or substringof('STOCKPM000110_REF2',COMPANYSCHEMA) or substringof('stockpm000110_ref2',COMPANYSCHEMA) or substringof('STOCKPM172200_REF2',COMPANYSCHEMA) or substringof('stockpm172200_ref2',COMPANYSCHEMA) or substringof('STOCKPM170737_REF',COMPANYSCHEMA) or substringof('stockpm170737_ref',COMPANYSCHEMA)    or substringof('DC',COMPANYSCHEMA) or substringof('dc',COMPANYSCHEMA) or substringof('STG',COMPANYSCHEMA) or substringof('stg',COMPANYSCHEMA) or substringof('HANAPM',COMPANYSCHEMA) or substringof('hanapm',COMPANYSCHEMA)) and indexof(UPGRADE_ELEMENT,'_') eq -1  and COMPANYID ne 'PAYNGPPRL' and COMPANYID ne 'USBASEIAS22V1' and COMPANYID ne 'SAPSDCHXM0001' and COMPANYID ne 'PAYNGPPRLE' and COMPANYSCHEMA ne '' and COMPANY ne '' and COMPANY ne 'SAP SF Cloud Engineering' and FILEVERSION eq '" +
						para + "' and TIME_STAMP ge datetime'" + fromCompDate + "' and TIME_STAMP le datetime'" + toCompDate + "' and " + fillBP;	
					}
					// var url =
					// 	"/UpgradeCenterResult?$select=UPGRADE_ELEMENT,RESULT,COMPANYSCHEMA,COMPANY,TIME_STAMP&$orderby=TIME_STAMP desc&$filter=(substringof('sfv4',COMPANYSCHEMA) or substringof('SFV4',COMPANYSCHEMA) or substringof('stockpm',COMPANYSCHEMA) or substringof('GLOBUSER_DVLHCM20S',COMPANYSCHEMA) or substringof('globuser_dvlhcm20s',COMPANYSCHEMA) or substringof('stockpm',COMPANYSCHEMA) or substringof('GLOBUSER_DVLHCM20S',COMPANYSCHEMA) or substringof('globuser_dvlhcm20s',COMPANYSCHEMA) or substringof('STOCKPM000110_REF2',COMPANYSCHEMA) or substringof('stockpm000110_ref2',COMPANYSCHEMA) or substringof('STOCKPM172200_REF2',COMPANYSCHEMA) or substringof('stockpm172200_ref2',COMPANYSCHEMA) or substringof('STOCKPM170737_REF',COMPANYSCHEMA) or substringof('stockpm170737_ref',COMPANYSCHEMA)    or substringof('DC',COMPANYSCHEMA) or substringof('dc',COMPANYSCHEMA) or substringof('STG',COMPANYSCHEMA) or substringof('stg',COMPANYSCHEMA) or substringof('HANAPM',COMPANYSCHEMA) or substringof('hanapm',COMPANYSCHEMA)) and COMPANYID ne 'PAYNGPPRL' and COMPANYID ne 'USBASEIAS22V1' and COMPANYID ne 'SAPSDCHXM0001' and COMPANYID ne 'PAYNGPPRLE' and COMPANYSCHEMA ne '' and COMPANY ne '' and COMPANY ne 'SAP SF Cloud Engineering' and FILEVERSION eq '" +
					// 	para + "' and TIME_STAMP ge datetime'" + fromCompDate + "' and TIME_STAMP le datetime'" + toCompDate + "' and " + fillBP;
				} else {
					if(deployKey=="All"){
				var url =
						"/UpgradeCenterResult?$select=UPGRADE_ELEMENT,RESULT,COMPANYSCHEMA,COMPANY,TIME_STAMP&$orderby=TIME_STAMP desc&$filter=(substringof('sfv4',COMPANYSCHEMA) or substringof('SFV4',COMPANYSCHEMA) or substringof('STOCKPM',COMPANYSCHEMA) or substringof('GLOBUSER_DVLHCM20S',COMPANYSCHEMA) or substringof('globuser_dvlhcm20s',COMPANYSCHEMA) or substringof('stockpm',COMPANYSCHEMA) or substringof('GLOBUSER_DVLHCM20S',COMPANYSCHEMA) or substringof('globuser_dvlhcm20s',COMPANYSCHEMA) or substringof('STOCKPM000110_REF2',COMPANYSCHEMA) or substringof('stockpm000110_ref2',COMPANYSCHEMA) or substringof('STOCKPM172200_REF2',COMPANYSCHEMA) or substringof('stockpm172200_ref2',COMPANYSCHEMA) or substringof('STOCKPM170737_REF',COMPANYSCHEMA) or substringof('stockpm170737_ref',COMPANYSCHEMA)    or substringof('DC',COMPANYSCHEMA) or substringof('dc',COMPANYSCHEMA) or substringof('STG',COMPANYSCHEMA) or substringof('stg',COMPANYSCHEMA) or substringof('HANAPM',COMPANYSCHEMA) or substringof('hanapm',COMPANYSCHEMA)) and COMPANYID ne 'PAYNGPPRL' and COMPANYID ne 'USBASEIAS22V1' and COMPANYID ne 'SAPSDCHXM0001' and COMPANYID ne 'PAYNGPPRLE' and COMPANYSCHEMA ne '' and COMPANY ne '' and COMPANY ne 'SAP SF Cloud Engineering' and TIME_STAMP ge datetime'" +
						fromCompDate + "' and TIME_STAMP le datetime'" + toCompDate + "' and " + fillBP;
					}else if(deployKey=="CUST"){
						var url =
						"/UpgradeCenterResult?$select=UPGRADE_ELEMENT,RESULT,COMPANYSCHEMA,COMPANY,TIME_STAMP&$orderby=TIME_STAMP desc&$filter=(substringof('sfv4',COMPANYSCHEMA) or substringof('SFV4',COMPANYSCHEMA) or substringof('STOCKPM',COMPANYSCHEMA) or substringof('GLOBUSER_DVLHCM20S',COMPANYSCHEMA) or substringof('globuser_dvlhcm20s',COMPANYSCHEMA) or substringof('stockpm',COMPANYSCHEMA) or substringof('GLOBUSER_DVLHCM20S',COMPANYSCHEMA) or substringof('globuser_dvlhcm20s',COMPANYSCHEMA) or substringof('STOCKPM000110_REF2',COMPANYSCHEMA) or substringof('stockpm000110_ref2',COMPANYSCHEMA) or substringof('STOCKPM172200_REF2',COMPANYSCHEMA) or substringof('stockpm172200_ref2',COMPANYSCHEMA) or substringof('STOCKPM170737_REF',COMPANYSCHEMA) or substringof('stockpm170737_ref',COMPANYSCHEMA)    or substringof('DC',COMPANYSCHEMA) or substringof('dc',COMPANYSCHEMA) or substringof('STG',COMPANYSCHEMA) or substringof('stg',COMPANYSCHEMA) or substringof('HANAPM',COMPANYSCHEMA) or substringof('hanapm',COMPANYSCHEMA)) and substringof('_',UPGRADE_ELEMENT) and COMPANYID ne 'PAYNGPPRL' and COMPANYID ne 'USBASEIAS22V1' and COMPANYID ne 'SAPSDCHXM0001' and COMPANYID ne 'PAYNGPPRLE' and COMPANYSCHEMA ne '' and COMPANY ne '' and COMPANY ne 'SAP SF Cloud Engineering' and TIME_STAMP ge datetime'" +
						fromCompDate + "' and TIME_STAMP le datetime'" + toCompDate + "' and " + fillBP;
					}else{
					var url =
						"/UpgradeCenterResult?$select=UPGRADE_ELEMENT,RESULT,COMPANYSCHEMA,COMPANY,TIME_STAMP&$orderby=TIME_STAMP desc&$filter=(substringof('sfv4',COMPANYSCHEMA) or substringof('SFV4',COMPANYSCHEMA) or substringof('STOCKPM',COMPANYSCHEMA) or substringof('GLOBUSER_DVLHCM20S',COMPANYSCHEMA) or substringof('globuser_dvlhcm20s',COMPANYSCHEMA) or substringof('stockpm',COMPANYSCHEMA) or substringof('GLOBUSER_DVLHCM20S',COMPANYSCHEMA) or substringof('globuser_dvlhcm20s',COMPANYSCHEMA) or substringof('STOCKPM000110_REF2',COMPANYSCHEMA) or substringof('stockpm000110_ref2',COMPANYSCHEMA) or substringof('STOCKPM172200_REF2',COMPANYSCHEMA) or substringof('stockpm172200_ref2',COMPANYSCHEMA) or substringof('STOCKPM170737_REF',COMPANYSCHEMA) or substringof('stockpm170737_ref',COMPANYSCHEMA)    or substringof('DC',COMPANYSCHEMA) or substringof('dc',COMPANYSCHEMA) or substringof('STG',COMPANYSCHEMA) or substringof('stg',COMPANYSCHEMA) or substringof('HANAPM',COMPANYSCHEMA) or substringof('hanapm',COMPANYSCHEMA)) and indexof(UPGRADE_ELEMENT,'_') eq -1  and COMPANYID ne 'PAYNGPPRL' and COMPANYID ne 'USBASEIAS22V1' and COMPANYID ne 'SAPSDCHXM0001' and COMPANYID ne 'PAYNGPPRLE' and COMPANYSCHEMA ne '' and COMPANY ne '' and COMPANY ne 'SAP SF Cloud Engineering' and TIME_STAMP ge datetime'" +
						fromCompDate + "' and TIME_STAMP le datetime'" + toCompDate + "' and " + fillBP;	
					}
					// var url =
					// 	"/UpgradeCenterResult?$select=UPGRADE_ELEMENT,RESULT,COMPANYSCHEMA,COMPANY,TIME_STAMP&$orderby=TIME_STAMP desc&$filter=(substringof('sfv4',COMPANYSCHEMA) or substringof('SFV4',COMPANYSCHEMA) or substringof('stockpm',COMPANYSCHEMA) or substringof('GLOBUSER_DVLHCM20S',COMPANYSCHEMA) or substringof('globuser_dvlhcm20s',COMPANYSCHEMA) or substringof('stockpm',COMPANYSCHEMA) or substringof('GLOBUSER_DVLHCM20S',COMPANYSCHEMA) or substringof('globuser_dvlhcm20s',COMPANYSCHEMA) or substringof('STOCKPM000110_REF2',COMPANYSCHEMA) or substringof('stockpm000110_ref2',COMPANYSCHEMA) or substringof('STOCKPM172200_REF2',COMPANYSCHEMA) or substringof('stockpm172200_ref2',COMPANYSCHEMA) or substringof('STOCKPM170737_REF',COMPANYSCHEMA) or substringof('stockpm170737_ref',COMPANYSCHEMA)    or substringof('DC',COMPANYSCHEMA) or substringof('dc',COMPANYSCHEMA) or substringof('STG',COMPANYSCHEMA) or substringof('stg',COMPANYSCHEMA) or substringof('HANAPM',COMPANYSCHEMA) or substringof('hanapm',COMPANYSCHEMA)) and COMPANYID ne 'PAYNGPPRL' and COMPANYID ne 'USBASEIAS22V1' and COMPANYID ne 'SAPSDCHXM0001' and COMPANYID ne 'PAYNGPPRLE' and COMPANYSCHEMA ne '' and COMPANY ne '' and COMPANY ne 'SAP SF Cloud Engineering' and TIME_STAMP ge datetime'" +
					// 	fromCompDate + "' and TIME_STAMP le datetime'" + toCompDate + "' and " + fillBP;
				}
			}

			mdl.read(
				url,
				null, null, true,
				function(oData, oResponse) {
					if(oData.results.length>0){
						tempODATAPreCheck = oData.results;
						for (var q = 0; q < tempODATAPreCheck.length; q++) {
							
							var majorBlk = tempODATAPreCheck[q].UPGRADE_ELEMENT.split("_");
							var lastItem = majorBlk[majorBlk.length-1];
							if(lastItem.length!=32){
								
						
								if(me.getView().byId("ddlProd").getSelectedKey()=="All"){
							
								
									tempODATAPreCheckFilter.push(tempODATAPreCheck[q]);
								}  else if(me.getView().byId("ddlProd").getSelectedKey()=="RM"){
			
									for(var a2=0;a2<datatempoModelUpgradeRecruitREC.length;a2++){
										
										if(tempODATAPreCheck[q].UPGRADE_ELEMENT.indexOf("_")==-1){
											
										
											if(tempODATAPreCheck[q].UPGRADE_ELEMENT==datatempoModelUpgradeRecruitREC[a2].UPGRADE_ELEMENT){
													// if(datatempoModelUpgradeRecruitREC[a2].PRODUCT=="Recruiting"){
														tempODATAPreCheckFilter.push(tempODATAPreCheck[q]);
														break;	
													// }
												}
											
										}else{
											var majorBlk = tempODATAPreCheck[q].UPGRADE_ELEMENT.split("_");
											var lastItem = majorBlk[majorBlk.length-1];
											if(lastItem.length==32){
												majorBlk.pop();
												var CompmajorBlk = majorBlk.join("_");
												if(CompmajorBlk==datatempoModelUpgradeRecruitREC[a2].UPGRADE_ELEMENT){
													// if(datatempoModelUpgradeRecruitREC[a2].PRODUCT=="Recruiting"){
														tempODATAPreCheckFilter.push(tempODATAPreCheck[q]);
														break;	
													// }
												}
											}else{
												majorBlk.pop();
												majorBlk.pop();
												var CompmajorBlk = majorBlk.join("_");
												if(CompmajorBlk==datatempoModelUpgradeRecruitREC[a2].UPGRADE_ELEMENT){
													// if(datatempoModelUpgradeRecruitREC[a2].PRODUCT=="Recruiting"){
														tempODATAPreCheckFilter.push(tempODATAPreCheck[q]);
														break;	
													// }
												}
											}
										}
										
										
										
										
										
									}
								}  else if(me.getView().byId("ddlProd").getSelectedKey()=="SM"){
									for(var a2=0;a2<datatempoModelUpgradeRecruitSM.length;a2++){
										
			// 							
										
										
											if(tempODATAPreCheck[q].UPGRADE_ELEMENT.indexOf("_")==-1){
												
										
											if(tempODATAPreCheck[q].UPGRADE_ELEMENT==datatempoModelUpgradeRecruitSM[a2].UPGRADE_ELEMENT){
													// if(oModelUpgradeRecruitData[a2].PRODUCT=="Succession Management"){
														tempODATAPreCheckFilter.push(tempODATAPreCheck[q]);
														break;	
													// }
												}
											
										}else{
											var majorBlk = tempODATAPreCheck[q].UPGRADE_ELEMENT.split("_");
											var lastItem = majorBlk[majorBlk.length-1];
											if(lastItem.length==32){
												majorBlk.pop();
												var CompmajorBlk = majorBlk.join("_");
												if(CompmajorBlk==datatempoModelUpgradeRecruitSM[a2].UPGRADE_ELEMENT){
													// if(oModelUpgradeRecruitData[a2].PRODUCT=="Succession Management"){
														tempODATAPreCheckFilter.push(tempODATAPreCheck[q]);
														break;	
													// }
												}
											}else{
												majorBlk.pop();
												majorBlk.pop();
												var CompmajorBlk = majorBlk.join("_");
												if(CompmajorBlk==datatempoModelUpgradeRecruitSM[a2].UPGRADE_ELEMENT){
													// if(oModelUpgradeRecruitData[a2].PRODUCT=="Succession Management"){
														tempODATAPreCheckFilter.push(tempODATAPreCheck[q]);
														break;	
													// }
												}
											}
										}
										
										
										
										
									}
								}  else if(me.getView().byId("ddlProd").getSelectedKey()=="PG"){
									for(var a2=0;a2<datatempoModelUpgradeRecruitPG.length;a2++){
										
										
									
										
										
										if(tempODATAPreCheck[q].UPGRADE_ELEMENT.indexOf("_")==-1){
										
												if(tempODATAPreCheck[q].UPGRADE_ELEMENT==datatempoModelUpgradeRecruitPG[a2].UPGRADE_ELEMENT){
													// if(oModelUpgradeRecruitData[a2].PRODUCT=="Performance and Goals"){
														tempODATAPreCheckFilter.push(tempODATAPreCheck[q]);
														break;	
													// }
												}
											
										}else{
											var majorBlk = tempODATAPreCheck[q].UPGRADE_ELEMENT.split("_");
											var lastItem = majorBlk[majorBlk.length-1];
											if(lastItem.length==32){
												majorBlk.pop();
												var CompmajorBlk = majorBlk.join("_");
												if(CompmajorBlk==datatempoModelUpgradeRecruitPG[a2].UPGRADE_ELEMENT){
													// if(oModelUpgradeRecruitData[a2].PRODUCT=="Performance and Goals"){
														tempODATAPreCheckFilter.push(tempODATAPreCheck[q]);
														break;	
													// }
												}
											}else{
												majorBlk.pop();
												majorBlk.pop();
												var CompmajorBlk = majorBlk.join("_");
												if(CompmajorBlk==datatempoModelUpgradeRecruitPG[a2].UPGRADE_ELEMENT){
													// if(oModelUpgradeRecruitData[a2].PRODUCT=="Performance and Goals"){
														tempODATAPreCheckFilter.push(tempODATAPreCheck[q]);
														break;	
													// }
												}
											}
										}
										
										
										
										
									}
								}  else if(me.getView().byId("ddlProd").getSelectedKey()=="CO"){
									for(var a2=0;a2<datatempoModelUpgradeRecruitCO.length;a2++){
										
									
			
										if(tempODATAPreCheck[q].UPGRADE_ELEMENT.indexOf("_")==-1){
											
										if(tempODATAPreCheck[q].UPGRADE_ELEMENT==datatempoModelUpgradeRecruitCO[a2].UPGRADE_ELEMENT){
											// if(oModelUpgradeRecruitData[a2].PRODUCT=="Compensation"){
												tempODATAPreCheckFilter.push(tempODATAPreCheck[q]);
												break;
											
											// }
											}
										
										}else{
											var majorBlk = tempODATAPreCheck[q].UPGRADE_ELEMENT.split("_");
											var lastItem = majorBlk[majorBlk.length-1];
											if(lastItem.length==32){
												majorBlk.pop();
												var CompmajorBlk = majorBlk.join("_");
												if(CompmajorBlk==datatempoModelUpgradeRecruitCO[a2].UPGRADE_ELEMENT){
													// if(oModelUpgradeRecruitData[a2].PRODUCT=="Compensation"){
														tempODATAPreCheckFilter.push(tempODATAPreCheck[q]);
														break;	
													// }
												}
											}else{
												majorBlk.pop();
												majorBlk.pop();
												var CompmajorBlk = majorBlk.join("_");
												if(CompmajorBlk==datatempoModelUpgradeRecruitCO[a2].UPGRADE_ELEMENT){
													// if(oModelUpgradeRecruitData[a2].PRODUCT=="Compensation"){
														tempODATAPreCheckFilter.push(tempODATAPreCheck[q]);
														break;	
													// }
												}
											}
										}
										
										
										
										
									}
								}  else if(me.getView().byId("ddlProd").getSelectedKey()=="ON"){
									for(var a2=0;a2<datatempoModelUpgradeRecruitON.length;a2++){
										
									
										
			
										if(tempODATAPreCheck[q].UPGRADE_ELEMENT.indexOf("_")==-1){
											
											if(tempODATAPreCheck[q].UPGRADE_ELEMENT==datatempoModelUpgradeRecruitON[a2].UPGRADE_ELEMENT){
											// if(oModelUpgradeRecruitData[a2].PRODUCT=="Onboarding" || oModelUpgradeRecruitData[a2].PRODUCT=="Onboarding 2.0"){
												tempODATAPreCheckFilter.push(tempODATAPreCheck[q]);
												break;
											// }
										}
										
											
										}else{
											var majorBlk = tempODATAPreCheck[q].UPGRADE_ELEMENT.split("_");
											var lastItem = majorBlk[majorBlk.length-1];
											if(lastItem.length==32){
												majorBlk.pop();
												var CompmajorBlk = majorBlk.join("_");
												if(CompmajorBlk==datatempoModelUpgradeRecruitON[a2].UPGRADE_ELEMENT){
													// if(oModelUpgradeRecruitData[a2].PRODUCT=="Onboarding" || oModelUpgradeRecruitData[a2].PRODUCT=="Onboarding 2.0"){
														tempODATAPreCheckFilter.push(tempODATAPreCheck[q]);
														break;	
													// }
												}
											}else{
												majorBlk.pop();
												majorBlk.pop();
												var CompmajorBlk = majorBlk.join("_");
												if(CompmajorBlk==datatempoModelUpgradeRecruitON[a2].UPGRADE_ELEMENT){
													// if(oModelUpgradeRecruitData[a2].PRODUCT=="Onboarding" || oModelUpgradeRecruitData[a2].PRODUCT=="Onboarding 2.0"){
														tempODATAPreCheckFilter.push(tempODATAPreCheck[q]);
														break;	
													// }
												}
											}
										}
										
										
										
									}
								}  else if(me.getView().byId("ddlProd").getSelectedKey()=="EC"){
									for(var a2=0; a2<datatempoModelUpgradeRecruitEC.length; a2++){
										
									// var datatempoModelUpgradeRecruitON = sap.ui.getCore().getModel("oModelUpgradeRecruitON").getData();
			// var datatempoModelUpgradeRecruitREC = sap.ui.getCore().getModel("oModelUpgradeRecruitREC").getData();
			// var datatempoModelUpgradeRecruitSM = sap.ui.getCore().getModel("oModelUpgradeRecruitSM").getData();
			// var datatempoModelUpgradeRecruitPG = sap.ui.getCore().getModel("oModelUpgradeRecruitPG").getData();
			// var datatempoModelUpgradeRecruitCO = sap.ui.getCore().getModel("oModelUpgradeRecruitCO").getData();
			// var datatempoModelUpgradeRecruitEC = sap.ui.getCore().getModel("oModelUpgradeRecruitEC").getData();
										
										
										if(tempODATAPreCheck[q].UPGRADE_ELEMENT.indexOf("_")==-1){
											
										
												if(tempODATAPreCheck[q].UPGRADE_ELEMENT==datatempoModelUpgradeRecruitEC[a2].UPGRADE_ELEMENT){
													// if(oModelUpgradeRecruitData[a2].PRODUCT=="Employee Central"){
														tempODATAPreCheckFilter.push(tempODATAPreCheck[q]);
														break;	
													// }
												}
											
										 
											
										}else{
											var majorBlk = tempODATAPreCheck[q].UPGRADE_ELEMENT.split("_");
											var lastItem = majorBlk[majorBlk.length-1];
											if(lastItem.length==32){
												majorBlk.pop();
												var CompmajorBlk = majorBlk.join("_");
												if(CompmajorBlk==datatempoModelUpgradeRecruitEC[a2].UPGRADE_ELEMENT){
													// if(datatempoModelUpgradeRecruitEC[a2].PRODUCT=="Employee Central"){
														tempODATAPreCheckFilter.push(tempODATAPreCheck[q]);
														break;	
													// }
												}
											}else{
												majorBlk.pop();
												majorBlk.pop();
												var CompmajorBlk = majorBlk.join("_");
												if(CompmajorBlk==datatempoModelUpgradeRecruitEC[a2].UPGRADE_ELEMENT){
													// if(oModelUpgradeRecruitData[a2].PRODUCT=="Employee Central"){
														tempODATAPreCheckFilter.push(tempODATAPreCheck[q]);
														break;	
													// }
												}
											}
										}
									}
								}
								
							}	
						}
					if (tempODATAPreCheckFilter.length > 0) {

						var oModelVersion = new sap.ui.model.json.JSONModel();
						oModelVersion.setSizeLimit(1000);
						sap.ui.getCore().setModel(oModelVersion, "oModelVersion");

						var oModelCustomer = new sap.ui.model.json.JSONModel();
						oModelCustomer.setSizeLimit(1000);
						sap.ui.getCore().setModel(oModelCustomer, "oModelCustomer");

						var tempODATA = [];
						var tempdataRg = [];
						var tempTimeData = [];
						var custName = [];
						var custUsers = [];

						tempdataRg.push({
							version: "Build Version",
							versionPara: "Version"
						});
						var tempData = [];
						var count = 0;
						for (var q = 0; q < tempODATAPreCheckFilter.length; q++) {
							// if(tempODATAPreCheckFilter[q].COMPANY=="CRUZ ROJA ESPAÑOLA"){
							// 	tempODATAPreCheckFilter[q].COMPANY="CRUZ ROJA ESPAÑOLA DESARROLLO";
							// }
							// if(tempODATAPreCheckFilter[q].COMPANY=="Release"){
							// 	tempODATAPreCheckFilter[q].COMPANY="Stericycle Inc (de)";
							// }
							if(tempODATAPreCheckFilter[q].COMPANY!="BPMCINSTANCE4" && tempODATAPreCheckFilter[q].COMPANY!="BPMCINSTANCE1"){
								if (tempODATAPreCheckFilter[q].COMPANYSCHEMA != null && tempODATAPreCheckFilter[q].COMPANYSCHEMA.toLowerCase().indexOf("sfsales")==-1) {
								// if (tempODATAPreCheckFilter[q].COMPANYSCHEMA.toLowerCase().indexOf("sfv4") > -1 ||tempODATAPreCheckFilter[q].COMPANYSCHEMA.toLowerCase().indexOf("hanapm") > -1  || tempODATAPreCheckFilter[q].COMPANYSCHEMA.toLowerCase().indexOf(
								// 		"stg") > -1 || tempODATAPreCheckFilter[q].COMPANYSCHEMA.toLowerCase().indexOf("stockpm172200_ref2") > -1 || tempODATAPreCheckFilter[q].COMPANYSCHEMA.toLowerCase().indexOf("dc") > -1) {
									tempODATA.push(tempODATAPreCheckFilter[q].COMPANY);

									if (tempODATAPreCheckFilter[q].RESULT == "true") {
										var stat = "Success";
									} else if (tempODATAPreCheckFilter[q].RESULT == "false") {
										var stat = "Failure";
									}

									if (tempODATAPreCheckFilter[q].UPGRADE_ELEMENT.split("Best Practice Configurations Employee Central")[1] == undefined) {
										if (tempODATAPreCheckFilter[q].UPGRADE_ELEMENT.split("bestpracticesEmployeeCentral")[1] == undefined) {
											// tempTimeData.push({
											// 	company: tempODATAPreCheckFilter[q].COMPANY,
											// 	result: stat,
											// 	upgrade:"EC "+tempODATAPreCheckFilter[q].UPGRADE_ELEMENT.split("Best Practices Employee Central")[1],
											// 	timestamp: tempODATAPreCheckFilter[q].TIME_STAMP.toDateString(),
											// 	puretimestamp: tempODATAPreCheckFilter[q].TIME_STAMP
											// });
											if (tempODATAPreCheckFilter[q].UPGRADE_ELEMENT.split("Best Practices Employee Central")[1] == undefined) {
												if (tempODATAPreCheckFilter[q].UPGRADE_ELEMENT.split("Best Practices")[1] == undefined) {
													if(tempODATAPreCheckFilter[q].UPGRADE_ELEMENT.split("Best Practice")[1]==undefined){
														tempTimeData.push({
															company: tempODATAPreCheckFilter[q].COMPANY,
															result: stat,
															upgrade: tempODATAPreCheckFilter[q].UPGRADE_ELEMENT,
															timestamp: tempODATAPreCheckFilter[q].TIME_STAMP.toUTCString(),//.toDateString(),
															puretimestamp: tempODATAPreCheckFilter[q].TIME_STAMP.toUTCString()
														});
													}else{
														tempTimeData.push({
															company: tempODATAPreCheckFilter[q].COMPANY,
															result: stat,
															upgrade: tempODATAPreCheckFilter[q].UPGRADE_ELEMENT.split("Best Practice")[1],
															timestamp: tempODATAPreCheckFilter[q].TIME_STAMP.toUTCString(),//.toDateString(),
															puretimestamp: tempODATAPreCheckFilter[q].TIME_STAMP.toUTCString()
														});
													}
													
												} else {
														if(tempODATAPreCheckFilter[q].UPGRADE_ELEMENT.indexOf("In-app learning")>-1){
															tempTimeData.push({
														company: tempODATAPreCheckFilter[q].COMPANY,
														result: stat,
														upgrade: tempODATAPreCheckFilter[q].UPGRADE_ELEMENT,
														timestamp: tempODATAPreCheckFilter[q].TIME_STAMP.toUTCString(),//.toDateString(),
														puretimestamp: tempODATAPreCheckFilter[q].TIME_STAMP.toUTCString()
													});
														}else{
															tempTimeData.push({
														company: tempODATAPreCheckFilter[q].COMPANY,
														result: stat,
														upgrade: tempODATAPreCheckFilter[q].UPGRADE_ELEMENT.split("Best Practices")[1],
														timestamp: tempODATAPreCheckFilter[q].TIME_STAMP.toUTCString(),//.toDateString(),
														puretimestamp: tempODATAPreCheckFilter[q].TIME_STAMP.toUTCString()
													});
														}
													
												}
											} else {
												tempTimeData.push({
													company: tempODATAPreCheckFilter[q].COMPANY,
													result: stat,
													upgrade: "EC " + tempODATAPreCheckFilter[q].UPGRADE_ELEMENT.split("Best Practices Employee Central")[1],
													timestamp: tempODATAPreCheckFilter[q].TIME_STAMP.toUTCString(),//.toDateString(),
													puretimestamp: tempODATAPreCheckFilter[q].TIME_STAMP.toUTCString()
												});
											}
										} else {
											tempTimeData.push({
												company: tempODATAPreCheckFilter[q].COMPANY,
												result: stat,
												upgrade: "EC " + tempODATAPreCheckFilter[q].UPGRADE_ELEMENT.split("bestpracticesEmployeeCentral")[1],
												timestamp: tempODATAPreCheckFilter[q].TIME_STAMP.toUTCString(),//.toDateString(),
												puretimestamp: tempODATAPreCheckFilter[q].TIME_STAMP.toUTCString()
											});
										}
									} else {
										tempTimeData.push({
											company: tempODATAPreCheckFilter[q].COMPANY,
											result: stat,
											upgrade: "EC " + tempODATAPreCheckFilter[q].UPGRADE_ELEMENT.split("Best Practice Configurations Employee Central")[1],
											timestamp: tempODATAPreCheckFilter[q].TIME_STAMP.toUTCString(),//.toDateString(),
											puretimestamp: tempODATAPreCheckFilter[q].TIME_STAMP.toUTCString()
										});

									}

									// tempTimeData.push({
									// 	company: tempODATAPreCheckFilter[q].COMPANY,
									// 	upgrade: tempODATAPreCheckFilter[q].UPGRADE_ELEMENT,
									// 	timestamp: tempODATAPreCheckFilter[q].TIME_STAMP.toDateString()
									// });
								// }
							}
							}
						}

						var unique = tempODATA.filter(function(itm, i, tempODATA) {
							return i == tempODATA.indexOf(itm);
						});

						// var uniqueVersion = tempData.reduce(function(item, e1) {
						// 	var matches = item.filter(function(e2) {
						// 		return e1.version == e2.version;
						// 	});
						// 	if (matches.length == 0) {
						// 		item.push(e1);
						// 	}
						// 	return item;
						// }, []);

						// uniqueVersion.unshift({
						// 	version: "Build Version",
						// 	versionPara: "Version"
						// });

						// var oDataGrp = {
						// 	"stlist": uniqueVersion
						// };

						// oModelVersion.setData(oDataGrp);
						// me.getView().byId("ddlVersion").setModel(oModelVersion);

						count = me.NumberFormat(Math.round(unique.length));
						// me.getView().byId("selTerLblDir").setInfo(count["value"] + count["type"]);
						
						
						me.callRefDataUpgrade(mdl,para,unique);

						// var tempTimeAry = [];

						// for (var w = 0; w < unique.length; w++) {
						// 	for (var z = 0; z < tempTimeData.length; z++) {
						// 		if (unique[w] == tempTimeData[z].company) {
						// 			tempTimeAry.push({
						// 				val: unique[w],
						// 				upgrade: [],
						// 				upgradeDisplay: [],
						// 				upgradeString: "",
						// 				time: tempTimeData[z].timestamp,
						// 				puretime: tempTimeData[z].puretimestamp
						// 			});
						// 			break;
						// 		}
						// 		// if (unique[w] == tempTimeData[z].company) {
						// 		// 	tempTimeAry.push({
						// 		// 		upgrade:tempTimeData[z].upgrade,
						// 		// 	});
						// 		// }
						// 	}
						// }

						// // for (var w = 0; w < tempTimeAry.length; w++) {
						// // 	for (var z = 0; z < tempTimeData.length; z++) {
						// // 		if (tempTimeAry[w].val == tempTimeData[z].company) {
						// // 			tempTimeAry[w].upgrade.push(tempTimeData[z].upgrade);
						// // 		}
						// // 	}
						// // }

						// for (var w = 0; w < tempTimeAry.length; w++) {
						// 	for (var z = 0; z < tempTimeData.length; z++) {
						// 		if (tempTimeAry[w].val == tempTimeData[z].company) {
						// 			if(tempTimeAry[w].upgrade.indexOf(tempTimeData[z].upgrade)==-1){
										
						// 				tempTimeAry[w].upgrade.push(tempTimeData[z].upgrade);
						// 				//tempTimeAry[w].upgradeDisplay.push(tempTimeData[z].upgrade + " - " +tempTimeData[z].result + " - " + tempTimeData[z].timestamp);
						// 				tempTimeAry[w].upgradeDisplay.push(tempTimeData[z].upgrade + " - " + tempTimeData[z].timestamp);
						// 			}
						// 		}
						// 	}
						// }

						// var uniqueData = [];
						// for (var w = 0; w < tempTimeAry.length; w++) {
						// 	var tempODATA = tempTimeAry[w].upgrade;

						// 	uniqueData.push({
						// 		index: w,
						// 		data: tempODATA.filter(function(itm, i, tempODATA) {
						// 			return i == tempODATA.indexOf(itm);
						// 		})
						// 	});

						// }
						// for (var w = 0; w < tempTimeAry.length; w++) {
						// 	tempTimeAry[w].upgrade = uniqueData[w].data;
						// }

						// var uniqueDataDisplay = [];
						// for (var w = 0; w < tempTimeAry.length; w++) {
						// 	var tempODATA = tempTimeAry[w].upgradeDisplay;

						// 	uniqueDataDisplay.push({
						// 		index: w,
						// 		dataInput: [],
						// 		data: tempODATA.filter(function(itm, i, tempODATA) {
						// 			return i == tempODATA.indexOf(itm);
						// 		})
						// 	});
						// }

						// // for(var w=0;w<uniqueDataDisplay.length;w++){
						// // 	var tempODATAInner = uniqueDataDisplay[w].data;
						// // 	for(var i in tempODATAInner){
						// // 		if(tempODATAInner[i]==1){
						// // 			uniqueDataDisplay[w].dataInput.push(i+" - "+tempODATAInner[i]+" time");
						// // 		}else{
						// // 			uniqueDataDisplay[w].dataInput.push(i+" - "+tempODATAInner[i]+" times");	
						// // 		}

						// // 	}
						// // }

						// for (var w = 0; w < tempTimeAry.length; w++) {

						// 	tempTimeAry[w].upgradeDisplay = uniqueDataDisplay[w].data;
						// }

						// for (var w = 0; w < tempTimeAry.length; w++) {
						// 	tempTimeAry[w].upgradeString = tempTimeAry[w].upgrade.toString();
						// }

						// var oDataGrpUsers = {
						// 	"stlistUser": tempTimeAry
						// };
						// oModelCustomer.setData(oDataGrpUsers);
						// me.getView().byId("listTable").setModel(oModelCustomer);

					}
					}else{
						me.callRefDataUpgrade(mdl,para,[]);
					}
				},
				function(oError) {
					// console.log("Error 127");
				});

		},
		
		callRefDataUpgrade:function(mdl,para,unique){
			var Datetoday = new Date();
			var fromDate = new Date();
			fromDate.setMonth((fromDate.getMonth() - 60));
			fromDate.setDate(fromDate.getDate() + 1);
			
			// if(fromDate.getDate()!=1){
			// 	fromDate.setDate(1);
			// }

			var fromCompDateAll = fromDate.toISOString();
			var toCompDateTemp = Datetoday.toISOString();

			fromCompDateAll = fromCompDateAll.split("T")[0] + "T00:00";
			toCompDateTemp = toCompDateTemp.split("T")[0] + "T24:00";
			var tempDateTo = (new Date(toCompDateTemp)).getDate();
			var d = new Date(toCompDateTemp);
			d.setDate(tempDateTo);
			var toCompDateAll = d.toISOString();
			toCompDateAll = toCompDateAll.split("T")[0] + "T24:00";

			var me = this;
			var tempODATAPreCheck = [];
			var tempODATAPreCheckFilter = [];
			// var oModelUpgradeRecruitData = sap.ui.getCore().getModel("oModelUpgradeRecruit").getData();
			
			var datatempoModelUpgradeRecruitON = sap.ui.getCore().getModel("oModelUpgradeRecruitON").getData();
			var datatempoModelUpgradeRecruitREC = sap.ui.getCore().getModel("oModelUpgradeRecruitREC").getData();
			var datatempoModelUpgradeRecruitSM = sap.ui.getCore().getModel("oModelUpgradeRecruitSM").getData();
			var datatempoModelUpgradeRecruitPG = sap.ui.getCore().getModel("oModelUpgradeRecruitPG").getData();
			var datatempoModelUpgradeRecruitCO = sap.ui.getCore().getModel("oModelUpgradeRecruitCO").getData();
			var datatempoModelUpgradeRecruitEC = sap.ui.getCore().getModel("oModelUpgradeRecruitEC").getData();
			
			
			
			var oModelUpgradeRefDataUpgradeData = sap.ui.getCore().getModel("oModelUpgradeRefDataUpgrade").getData();
			
			if(oModelUpgradeRefDataUpgradeData.length>0){
				
				tempODATAPreCheck = oModelUpgradeRefDataUpgradeData;
							for (var q = 0; q < tempODATAPreCheck.length; q++) {
								
								var majorBlk = tempODATAPreCheck[q].UPGRADE_ELEMENT.split("_");
								var lastItem = majorBlk[majorBlk.length-1];
								if(lastItem.length!=32){
								
									if(me.getView().byId("ddlProd").getSelectedKey()=="All"){
							
								
									tempODATAPreCheckFilter.push(tempODATAPreCheck[q]);
								}  else if(me.getView().byId("ddlProd").getSelectedKey()=="RM"){
			
									for(var a2=0;a2<datatempoModelUpgradeRecruitREC.length;a2++){
										
										if(tempODATAPreCheck[q].UPGRADE_ELEMENT.indexOf("_")==-1){
											
										
											if(tempODATAPreCheck[q].UPGRADE_ELEMENT==datatempoModelUpgradeRecruitREC[a2].UPGRADE_ELEMENT){
													// if(datatempoModelUpgradeRecruitREC[a2].PRODUCT=="Recruiting"){
														tempODATAPreCheckFilter.push(tempODATAPreCheck[q]);
														break;	
													// }
												}
											
										}else{
											var majorBlk = tempODATAPreCheck[q].UPGRADE_ELEMENT.split("_");
											var lastItem = majorBlk[majorBlk.length-1];
											if(lastItem.length==32){
												majorBlk.pop();
												var CompmajorBlk = majorBlk.join("_");
												if(CompmajorBlk==datatempoModelUpgradeRecruitREC[a2].UPGRADE_ELEMENT){
													// if(datatempoModelUpgradeRecruitREC[a2].PRODUCT=="Recruiting"){
														tempODATAPreCheckFilter.push(tempODATAPreCheck[q]);
														break;	
													// }
												}
											}else{
												majorBlk.pop();
												majorBlk.pop();
												var CompmajorBlk = majorBlk.join("_");
												if(CompmajorBlk==datatempoModelUpgradeRecruitREC[a2].UPGRADE_ELEMENT){
													// if(datatempoModelUpgradeRecruitREC[a2].PRODUCT=="Recruiting"){
														tempODATAPreCheckFilter.push(tempODATAPreCheck[q]);
														break;	
													// }
												}
											}
										}
										
										
										
										
										
									}
								}  else if(me.getView().byId("ddlProd").getSelectedKey()=="SM"){
									for(var a2=0;a2<datatempoModelUpgradeRecruitSM.length;a2++){
										
			// 							
										
										
											if(tempODATAPreCheck[q].UPGRADE_ELEMENT.indexOf("_")==-1){
												
										
											if(tempODATAPreCheck[q].UPGRADE_ELEMENT==datatempoModelUpgradeRecruitSM[a2].UPGRADE_ELEMENT){
													// if(oModelUpgradeRecruitData[a2].PRODUCT=="Succession Management"){
														tempODATAPreCheckFilter.push(tempODATAPreCheck[q]);
														break;	
													// }
												}
											
										}else{
											var majorBlk = tempODATAPreCheck[q].UPGRADE_ELEMENT.split("_");
											var lastItem = majorBlk[majorBlk.length-1];
											if(lastItem.length==32){
												majorBlk.pop();
												var CompmajorBlk = majorBlk.join("_");
												if(CompmajorBlk==datatempoModelUpgradeRecruitSM[a2].UPGRADE_ELEMENT){
													// if(oModelUpgradeRecruitData[a2].PRODUCT=="Succession Management"){
														tempODATAPreCheckFilter.push(tempODATAPreCheck[q]);
														break;	
													// }
												}
											}else{
												majorBlk.pop();
												majorBlk.pop();
												var CompmajorBlk = majorBlk.join("_");
												if(CompmajorBlk==datatempoModelUpgradeRecruitSM[a2].UPGRADE_ELEMENT){
													// if(oModelUpgradeRecruitData[a2].PRODUCT=="Succession Management"){
														tempODATAPreCheckFilter.push(tempODATAPreCheck[q]);
														break;	
													// }
												}
											}
										}
										
										
										
										
									}
								}  else if(me.getView().byId("ddlProd").getSelectedKey()=="PG"){
									for(var a2=0;a2<datatempoModelUpgradeRecruitPG.length;a2++){
										
										
									
										
										
										if(tempODATAPreCheck[q].UPGRADE_ELEMENT.indexOf("_")==-1){
										
												if(tempODATAPreCheck[q].UPGRADE_ELEMENT==datatempoModelUpgradeRecruitPG[a2].UPGRADE_ELEMENT){
													// if(oModelUpgradeRecruitData[a2].PRODUCT=="Performance and Goals"){
														tempODATAPreCheckFilter.push(tempODATAPreCheck[q]);
														break;	
													// }
												}
											
										}else{
											var majorBlk = tempODATAPreCheck[q].UPGRADE_ELEMENT.split("_");
											var lastItem = majorBlk[majorBlk.length-1];
											if(lastItem.length==32){
												majorBlk.pop();
												var CompmajorBlk = majorBlk.join("_");
												if(CompmajorBlk==datatempoModelUpgradeRecruitPG[a2].UPGRADE_ELEMENT){
													// if(oModelUpgradeRecruitData[a2].PRODUCT=="Performance and Goals"){
														tempODATAPreCheckFilter.push(tempODATAPreCheck[q]);
														break;	
													// }
												}
											}else{
												majorBlk.pop();
												majorBlk.pop();
												var CompmajorBlk = majorBlk.join("_");
												if(CompmajorBlk==datatempoModelUpgradeRecruitPG[a2].UPGRADE_ELEMENT){
													// if(oModelUpgradeRecruitData[a2].PRODUCT=="Performance and Goals"){
														tempODATAPreCheckFilter.push(tempODATAPreCheck[q]);
														break;	
													// }
												}
											}
										}
										
										
										
										
									}
								}  else if(me.getView().byId("ddlProd").getSelectedKey()=="CO"){
									for(var a2=0;a2<datatempoModelUpgradeRecruitCO.length;a2++){
										
									
			
										if(tempODATAPreCheck[q].UPGRADE_ELEMENT.indexOf("_")==-1){
											
										if(tempODATAPreCheck[q].UPGRADE_ELEMENT==datatempoModelUpgradeRecruitCO[a2].UPGRADE_ELEMENT){
											// if(oModelUpgradeRecruitData[a2].PRODUCT=="Compensation"){
												tempODATAPreCheckFilter.push(tempODATAPreCheck[q]);
												break;
											
											// }
											}
										
										}else{
											var majorBlk = tempODATAPreCheck[q].UPGRADE_ELEMENT.split("_");
											var lastItem = majorBlk[majorBlk.length-1];
											if(lastItem.length==32){
												majorBlk.pop();
												var CompmajorBlk = majorBlk.join("_");
												if(CompmajorBlk==datatempoModelUpgradeRecruitCO[a2].UPGRADE_ELEMENT){
													// if(oModelUpgradeRecruitData[a2].PRODUCT=="Compensation"){
														tempODATAPreCheckFilter.push(tempODATAPreCheck[q]);
														break;	
													// }
												}
											}else{
												majorBlk.pop();
												majorBlk.pop();
												var CompmajorBlk = majorBlk.join("_");
												if(CompmajorBlk==datatempoModelUpgradeRecruitCO[a2].UPGRADE_ELEMENT){
													// if(oModelUpgradeRecruitData[a2].PRODUCT=="Compensation"){
														tempODATAPreCheckFilter.push(tempODATAPreCheck[q]);
														break;	
													// }
												}
											}
										}
										
										
										
										
									}
								}  else if(me.getView().byId("ddlProd").getSelectedKey()=="ON"){
									for(var a2=0;a2<datatempoModelUpgradeRecruitON.length;a2++){
										
									
										
			
										if(tempODATAPreCheck[q].UPGRADE_ELEMENT.indexOf("_")==-1){
											
											if(tempODATAPreCheck[q].UPGRADE_ELEMENT==datatempoModelUpgradeRecruitON[a2].UPGRADE_ELEMENT){
											// if(oModelUpgradeRecruitData[a2].PRODUCT=="Onboarding" || oModelUpgradeRecruitData[a2].PRODUCT=="Onboarding 2.0"){
												tempODATAPreCheckFilter.push(tempODATAPreCheck[q]);
												break;
											// }
										}
										
											
										}else{
											var majorBlk = tempODATAPreCheck[q].UPGRADE_ELEMENT.split("_");
											var lastItem = majorBlk[majorBlk.length-1];
											if(lastItem.length==32){
												majorBlk.pop();
												var CompmajorBlk = majorBlk.join("_");
												if(CompmajorBlk==datatempoModelUpgradeRecruitON[a2].UPGRADE_ELEMENT){
													// if(oModelUpgradeRecruitData[a2].PRODUCT=="Onboarding" || oModelUpgradeRecruitData[a2].PRODUCT=="Onboarding 2.0"){
														tempODATAPreCheckFilter.push(tempODATAPreCheck[q]);
														break;	
													// }
												}
											}else{
												majorBlk.pop();
												majorBlk.pop();
												var CompmajorBlk = majorBlk.join("_");
												if(CompmajorBlk==datatempoModelUpgradeRecruitON[a2].UPGRADE_ELEMENT){
													// if(oModelUpgradeRecruitData[a2].PRODUCT=="Onboarding" || oModelUpgradeRecruitData[a2].PRODUCT=="Onboarding 2.0"){
														tempODATAPreCheckFilter.push(tempODATAPreCheck[q]);
														break;	
													// }
												}
											}
										}
										
										
										
									}
								}  else if(me.getView().byId("ddlProd").getSelectedKey()=="EC"){
									for(var a2=0; a2<datatempoModelUpgradeRecruitEC.length; a2++){
										
									// var datatempoModelUpgradeRecruitON = sap.ui.getCore().getModel("oModelUpgradeRecruitON").getData();
			// var datatempoModelUpgradeRecruitREC = sap.ui.getCore().getModel("oModelUpgradeRecruitREC").getData();
			// var datatempoModelUpgradeRecruitSM = sap.ui.getCore().getModel("oModelUpgradeRecruitSM").getData();
			// var datatempoModelUpgradeRecruitPG = sap.ui.getCore().getModel("oModelUpgradeRecruitPG").getData();
			// var datatempoModelUpgradeRecruitCO = sap.ui.getCore().getModel("oModelUpgradeRecruitCO").getData();
			// var datatempoModelUpgradeRecruitEC = sap.ui.getCore().getModel("oModelUpgradeRecruitEC").getData();
										
										
										if(tempODATAPreCheck[q].UPGRADE_ELEMENT.indexOf("_")==-1){
											
										
												if(tempODATAPreCheck[q].UPGRADE_ELEMENT==datatempoModelUpgradeRecruitEC[a2].UPGRADE_ELEMENT){
													// if(oModelUpgradeRecruitData[a2].PRODUCT=="Employee Central"){
														tempODATAPreCheckFilter.push(tempODATAPreCheck[q]);
														break;	
													// }
												}
											
										 
											
										}else{
											var majorBlk = tempODATAPreCheck[q].UPGRADE_ELEMENT.split("_");
											var lastItem = majorBlk[majorBlk.length-1];
											if(lastItem.length==32){
												majorBlk.pop();
												var CompmajorBlk = majorBlk.join("_");
												if(CompmajorBlk==datatempoModelUpgradeRecruitEC[a2].UPGRADE_ELEMENT){
													// if(datatempoModelUpgradeRecruitEC[a2].PRODUCT=="Employee Central"){
														tempODATAPreCheckFilter.push(tempODATAPreCheck[q]);
														break;	
													// }
												}
											}else{
												majorBlk.pop();
												majorBlk.pop();
												var CompmajorBlk = majorBlk.join("_");
												if(CompmajorBlk==datatempoModelUpgradeRecruitEC[a2].UPGRADE_ELEMENT){
													// if(oModelUpgradeRecruitData[a2].PRODUCT=="Employee Central"){
														tempODATAPreCheckFilter.push(tempODATAPreCheck[q]);
														break;	
													// }
												}
											}
										}
									}
								}
								}
							}
							if (tempODATAPreCheckFilter.length > 0) {
	
							var oModelVersion = new sap.ui.model.json.JSONModel();
							oModelVersion.setSizeLimit(1000);
							sap.ui.getCore().setModel(oModelVersion, "oModelVersion");
	
							var oModelCustomer = new sap.ui.model.json.JSONModel();
							oModelCustomer.setSizeLimit(1000);
							sap.ui.getCore().setModel(oModelCustomer, "oModelCustomer");
	
							var tempODATA = [];
							var tempdataRg = [];
							var tempTimeData = [];
							var custName = [];
							var custUsers = [];
	
							tempdataRg.push({
								version: "Build Version",
								versionPara: "Version"
							});
							var tempData = [];
							var count = 0;
							for (var q = 0; q < tempODATAPreCheckFilter.length; q++) {
								// if(tempODATAPreCheckFilter[q].COMPANY=="CRUZ ROJA ESPAÑOLA"){
								// 	tempODATAPreCheckFilter[q].COMPANY="CRUZ ROJA ESPAÑOLA DESARROLLO";
								// }
								// if(tempODATAPreCheckFilter[q].COMPANY=="Release"){
								// 	tempODATAPreCheckFilter[q].COMPANY="Stericycle Inc (de)";
								// }
								if(tempODATAPreCheckFilter[q].COMPANY!="BPMCINSTANCE4" && tempODATAPreCheckFilter[q].COMPANY!="BPMCINSTANCE1"){
									if (tempODATAPreCheckFilter[q].COMPANYSCHEMA != null && tempODATAPreCheckFilter[q].COMPANYSCHEMA.toLowerCase().indexOf("sfsales")==-1) {
									// if (tempODATAPreCheckFilter[q].COMPANYSCHEMA.toLowerCase().indexOf("sfv4") > -1 || tempODATAPreCheckFilter[q].COMPANYSCHEMA.toLowerCase().indexOf("hanapm") > -1 || tempODATAPreCheckFilter[q].COMPANYSCHEMA.toLowerCase().indexOf(
									// 		"stg") > -1 || tempODATAPreCheckFilter[q].COMPANYSCHEMA.toLowerCase().indexOf("stockpm172200_ref2") > -1 || tempODATAPreCheckFilter[q].COMPANYSCHEMA.toLowerCase().indexOf("dc") > -1) {
	
										if (tempODATAPreCheckFilter[q].RESULT == "true") {
											var stat = "Success";
										} else if (tempODATAPreCheckFilter[q].RESULT == "false") {
											var stat = "Failure";
										}
	
										if (tempODATAPreCheckFilter[q].UPGRADE_ELEMENT.split("Best Practice Configurations Employee Central")[1] == undefined) {
											if (tempODATAPreCheckFilter[q].UPGRADE_ELEMENT.split("bestpracticesEmployeeCentral")[1] == undefined) {
												// tempTimeData.push({
												// 	company: tempODATAPreCheckFilter[q].COMPANY,
												// 	result: stat,
												// 	upgrade:"EC "+tempODATAPreCheckFilter[q].UPGRADE_ELEMENT.split("Best Practices Employee Central")[1],
												// 	timestamp: tempODATAPreCheckFilter[q].TIME_STAMP.toDateString(),
												// 	puretimestamp: tempODATAPreCheckFilter[q].TIME_STAMP
												// });
												if (tempODATAPreCheckFilter[q].UPGRADE_ELEMENT.split("Best Practices Employee Central")[1] == undefined) {
													if (tempODATAPreCheckFilter[q].UPGRADE_ELEMENT.split("Best Practices")[1] == undefined) {
														if(tempODATAPreCheckFilter[q].UPGRADE_ELEMENT.split("Best Practice")[1]==undefined){
															tempTimeData.push({
																company: tempODATAPreCheckFilter[q].COMPANY,
																result: stat,
																upgrade: tempODATAPreCheckFilter[q].UPGRADE_ELEMENT,
																timestamp: tempODATAPreCheckFilter[q].TIME_STAMP.toUTCString(),//.toDateString(),
																puretimestamp: tempODATAPreCheckFilter[q].TIME_STAMP.toUTCString()
															});
														}else{
															tempTimeData.push({
																company: tempODATAPreCheckFilter[q].COMPANY,
																result: stat,
																upgrade: tempODATAPreCheckFilter[q].UPGRADE_ELEMENT.split("Best Practice")[1],
																timestamp: tempODATAPreCheckFilter[q].TIME_STAMP.toUTCString(),//.toDateString(),
																puretimestamp: tempODATAPreCheckFilter[q].TIME_STAMP.toUTCString()
															});
														}
													} else {
														if(tempODATAPreCheckFilter[q].UPGRADE_ELEMENT.indexOf("In-app learning")>-1){
															tempTimeData.push({
															company: tempODATAPreCheckFilter[q].COMPANY,
															result: stat,
															upgrade: tempODATAPreCheckFilter[q].UPGRADE_ELEMENT,
															timestamp: tempODATAPreCheckFilter[q].TIME_STAMP.toUTCString(),//.toDateString(),
															puretimestamp: tempODATAPreCheckFilter[q].TIME_STAMP.toUTCString()
														});
														}else{
															tempTimeData.push({
															company: tempODATAPreCheckFilter[q].COMPANY,
															result: stat,
															upgrade: tempODATAPreCheckFilter[q].UPGRADE_ELEMENT.split("Best Practices")[1],
															timestamp: tempODATAPreCheckFilter[q].TIME_STAMP.toUTCString(),//.toDateString(),
															puretimestamp: tempODATAPreCheckFilter[q].TIME_STAMP.toUTCString()
														});
														}
														
													}
												} else {
													tempTimeData.push({
														company: tempODATAPreCheckFilter[q].COMPANY,
														result: stat,
														upgrade: "EC " + tempODATAPreCheckFilter[q].UPGRADE_ELEMENT.split("Best Practices Employee Central")[1],
														timestamp: tempODATAPreCheckFilter[q].TIME_STAMP.toUTCString(),//.toDateString(),
														puretimestamp: tempODATAPreCheckFilter[q].TIME_STAMP.toUTCString()
													});
												}
											} else {
												tempTimeData.push({
													company: tempODATAPreCheckFilter[q].COMPANY,
													result: stat,
													upgrade: "EC " + tempODATAPreCheckFilter[q].UPGRADE_ELEMENT.split("bestpracticesEmployeeCentral")[1],
													timestamp: tempODATAPreCheckFilter[q].TIME_STAMP.toUTCString(),//.toDateString(),
													puretimestamp: tempODATAPreCheckFilter[q].TIME_STAMP.toUTCString()
												});
											}
										} else {
											tempTimeData.push({
												company: tempODATAPreCheckFilter[q].COMPANY,
												result: stat,
												upgrade: "EC " + tempODATAPreCheckFilter[q].UPGRADE_ELEMENT.split("Best Practice Configurations Employee Central")[1],
												timestamp: tempODATAPreCheckFilter[q].TIME_STAMP.toUTCString(),//.toDateString(),
												puretimestamp: tempODATAPreCheckFilter[q].TIME_STAMP.toUTCString()
											});
	
										}
	
										// tempTimeData.push({
										// 	company: tempODATAPreCheckFilter[q].COMPANY,
										// 	upgrade: tempODATAPreCheckFilter[q].UPGRADE_ELEMENT,
										// 	timestamp: tempODATAPreCheckFilter[q].TIME_STAMP.toDateString()
										// });
									// }
								}
								}
							}
	
							var tempTimeAry = [];
	
							for (var w = 0; w < unique.length; w++) {
								for (var z = 0; z < tempTimeData.length; z++) {
									if (unique[w] == tempTimeData[z].company) {
										tempTimeAry.push({
											val: unique[w],
											upgrade: [],
											upgradeDisplay: [],
											upgradeString: "",
											time: (tempTimeData[z].timestamp).split(' ', 4).join(' '),
											puretime: tempTimeData[z].puretimestamp
										});
										break;
									}
									//date = dateTime.split(' ', 4).join(' ');
									// if (unique[w] == tempTimeData[z].company) {
									// 	tempTimeAry.push({
									// 		upgrade:tempTimeData[z].upgrade,
									// 	});
									// }
								}
							}
	
							// for (var w = 0; w < tempTimeAry.length; w++) {
							// 	for (var z = 0; z < tempTimeData.length; z++) {
							// 		if (tempTimeAry[w].val == tempTimeData[z].company) {
							// 			tempTimeAry[w].upgrade.push(tempTimeData[z].upgrade);
							// 		}
							// 	}
							// }
	
							for (var w = 0; w < tempTimeAry.length; w++) {
								for (var z = 0; z < tempTimeData.length; z++) {
									if (tempTimeAry[w].val == tempTimeData[z].company) {
										if(tempTimeAry[w].upgrade.indexOf(tempTimeData[z].upgrade)==-1){
											
											tempTimeAry[w].upgrade.push(tempTimeData[z].upgrade);
											//tempTimeAry[w].upgradeDisplay.push(tempTimeData[z].upgrade + " - " +tempTimeData[z].result + " - " + tempTimeData[z].timestamp);
											tempTimeAry[w].upgradeDisplay.push(tempTimeData[z].upgrade + " - " + ((tempTimeData[z].timestamp).split(' ', 4).join(' ')).replace(","," "));
										}
									}
								}
							}
	
							var uniqueData = [];
							for (var w = 0; w < tempTimeAry.length; w++) {
								var tempODATA = tempTimeAry[w].upgrade;
	
								uniqueData.push({
									index: w,
									data: tempODATA.filter(function(itm, i, tempODATA) {
										return i == tempODATA.indexOf(itm);
									})
								});
	
							}
							for (var w = 0; w < tempTimeAry.length; w++) {
								tempTimeAry[w].upgrade = uniqueData[w].data;
							}
	
							var uniqueDataDisplay = [];
							for (var w = 0; w < tempTimeAry.length; w++) {
								var tempODATA = tempTimeAry[w].upgradeDisplay;
	
								uniqueDataDisplay.push({
									index: w,
									dataInput: [],
									data: tempODATA.filter(function(itm, i, tempODATA) {
										return i == tempODATA.indexOf(itm);
									})
								});
							}
	
							// for(var w=0;w<uniqueDataDisplay.length;w++){
							// 	var tempODATAInner = uniqueDataDisplay[w].data;
							// 	for(var i in tempODATAInner){
							// 		if(tempODATAInner[i]==1){
							// 			uniqueDataDisplay[w].dataInput.push(i+" - "+tempODATAInner[i]+" time");
							// 		}else{
							// 			uniqueDataDisplay[w].dataInput.push(i+" - "+tempODATAInner[i]+" times");	
							// 		}
	
							// 	}
							// }
	
							for (var w = 0; w < tempTimeAry.length; w++) {
	
								tempTimeAry[w].upgradeDisplay = uniqueDataDisplay[w].data;
							}
	
							for (var w = 0; w < tempTimeAry.length; w++) {
								tempTimeAry[w].upgradeString = tempTimeAry[w].upgrade.toString();
							}
	
							var oDataGrpUsers = {
								"stlistUser": tempTimeAry
							};
							oModelCustomer.setData(oDataGrpUsers);
							me.getView().byId("listTable").setModel(oModelCustomer);
	
						}
			}else{
				
				if (para != "") {
					var url =
						"/UpgradeCenterResult?$select=UPGRADE_ELEMENT,RESULT,COMPANYSCHEMA,COMPANY,TIME_STAMP&$orderby=TIME_STAMP desc&$filter=(substringof('sfv4',COMPANYSCHEMA) or substringof('SFV4',COMPANYSCHEMA) or substringof('STOCKPM',COMPANYSCHEMA) or substringof('GLOBUSER_DVLHCM20S',COMPANYSCHEMA) or substringof('globuser_dvlhcm20s',COMPANYSCHEMA) or substringof('stockpm',COMPANYSCHEMA) or substringof('GLOBUSER_DVLHCM20S',COMPANYSCHEMA) or substringof('globuser_dvlhcm20s',COMPANYSCHEMA) or substringof('STOCKPM000110_REF2',COMPANYSCHEMA) or substringof('stockpm000110_ref2',COMPANYSCHEMA) or substringof('STOCKPM172200_REF2',COMPANYSCHEMA) or substringof('stockpm172200_ref2',COMPANYSCHEMA) or substringof('STOCKPM170737_REF',COMPANYSCHEMA) or substringof('stockpm170737_ref',COMPANYSCHEMA)    or substringof('DC',COMPANYSCHEMA) or substringof('dc',COMPANYSCHEMA) or substringof('STG',COMPANYSCHEMA) or substringof('stg',COMPANYSCHEMA) or substringof('HANAPM',COMPANYSCHEMA) or substringof('hanapm',COMPANYSCHEMA)) and COMPANYID ne 'PAYNGPPRL' and COMPANYID ne 'USBASEIAS22V1' and COMPANYID ne 'SAPSDCHXM0001' and COMPANYID ne 'PAYNGPPRLE' and COMPANYSCHEMA ne '' and COMPANY ne '' and COMPANY ne 'SAP SF Cloud Engineering' and FILEVERSION eq '" +
						para + "' and TIME_STAMP ge datetime'" + fromCompDateAll + "' and TIME_STAMP le datetime'" + toCompDateAll + "'";
				} else {
					var url =
						"/UpgradeCenterResult?$select=UPGRADE_ELEMENT,RESULT,COMPANYSCHEMA,COMPANY,TIME_STAMP&$orderby=TIME_STAMP desc&$filter=(substringof('sfv4',COMPANYSCHEMA) or substringof('SFV4',COMPANYSCHEMA) or substringof('STOCKPM',COMPANYSCHEMA) or substringof('GLOBUSER_DVLHCM20S',COMPANYSCHEMA) or substringof('globuser_dvlhcm20s',COMPANYSCHEMA) or substringof('stockpm',COMPANYSCHEMA) or substringof('GLOBUSER_DVLHCM20S',COMPANYSCHEMA) or substringof('globuser_dvlhcm20s',COMPANYSCHEMA) or substringof('STOCKPM000110_REF2',COMPANYSCHEMA) or substringof('stockpm000110_ref2',COMPANYSCHEMA) or substringof('STOCKPM172200_REF2',COMPANYSCHEMA) or substringof('stockpm172200_ref2',COMPANYSCHEMA) or substringof('STOCKPM170737_REF',COMPANYSCHEMA) or substringof('stockpm170737_ref',COMPANYSCHEMA)    or substringof('DC',COMPANYSCHEMA) or substringof('dc',COMPANYSCHEMA) or substringof('STG',COMPANYSCHEMA) or substringof('stg',COMPANYSCHEMA) or substringof('HANAPM',COMPANYSCHEMA) or substringof('hanapm',COMPANYSCHEMA)) and COMPANYID ne 'PAYNGPPRL' and COMPANYID ne 'USBASEIAS22V1' and COMPANYID ne 'SAPSDCHXM0001' and COMPANYID ne 'PAYNGPPRLE' and COMPANYSCHEMA ne '' and COMPANY ne '' and COMPANY ne 'SAP SF Cloud Engineering' and TIME_STAMP ge datetime'" +
						fromCompDateAll + "' and TIME_STAMP le datetime'" + toCompDateAll + "'";
				}
				
				mdl.read(
					url,
					null, null, true,
					function(oData, oResponse) {
						if(oData.results.length>0){
							
							var datatemp = oData.results;
						
							sap.ui.getCore().getModel("oModelUpgradeRefDataUpgrade").setData(datatemp);
							
							tempODATAPreCheck = oData.results;
							for (var q = 0; q < tempODATAPreCheck.length; q++) {
								
								var majorBlk = tempODATAPreCheck[q].UPGRADE_ELEMENT.split("_");
								var lastItem = majorBlk[majorBlk.length-1];
								if(lastItem.length!=32){
								
									if(me.getView().byId("ddlProd").getSelectedKey()=="All"){
							
								
									tempODATAPreCheckFilter.push(tempODATAPreCheck[q]);
								}  else if(me.getView().byId("ddlProd").getSelectedKey()=="RM"){
			
									for(var a2=0;a2<datatempoModelUpgradeRecruitREC.length;a2++){
										
										if(tempODATAPreCheck[q].UPGRADE_ELEMENT.indexOf("_")==-1){
											
										
											if(tempODATAPreCheck[q].UPGRADE_ELEMENT==datatempoModelUpgradeRecruitREC[a2].UPGRADE_ELEMENT){
													// if(datatempoModelUpgradeRecruitREC[a2].PRODUCT=="Recruiting"){
														tempODATAPreCheckFilter.push(tempODATAPreCheck[q]);
														break;	
													// }
												}
											
										}else{
											var majorBlk = tempODATAPreCheck[q].UPGRADE_ELEMENT.split("_");
											var lastItem = majorBlk[majorBlk.length-1];
											if(lastItem.length==32){
												majorBlk.pop();
												var CompmajorBlk = majorBlk.join("_");
												if(CompmajorBlk==datatempoModelUpgradeRecruitREC[a2].UPGRADE_ELEMENT){
													// if(datatempoModelUpgradeRecruitREC[a2].PRODUCT=="Recruiting"){
														tempODATAPreCheckFilter.push(tempODATAPreCheck[q]);
														break;	
													// }
												}
											}else{
												majorBlk.pop();
												majorBlk.pop();
												var CompmajorBlk = majorBlk.join("_");
												if(CompmajorBlk==datatempoModelUpgradeRecruitREC[a2].UPGRADE_ELEMENT){
													// if(datatempoModelUpgradeRecruitREC[a2].PRODUCT=="Recruiting"){
														tempODATAPreCheckFilter.push(tempODATAPreCheck[q]);
														break;	
													// }
												}
											}
										}
										
										
										
										
										
									}
								}  else if(me.getView().byId("ddlProd").getSelectedKey()=="SM"){
									for(var a2=0;a2<datatempoModelUpgradeRecruitSM.length;a2++){
										
			// 							
										
										
											if(tempODATAPreCheck[q].UPGRADE_ELEMENT.indexOf("_")==-1){
												
										
											if(tempODATAPreCheck[q].UPGRADE_ELEMENT==datatempoModelUpgradeRecruitSM[a2].UPGRADE_ELEMENT){
													// if(oModelUpgradeRecruitData[a2].PRODUCT=="Succession Management"){
														tempODATAPreCheckFilter.push(tempODATAPreCheck[q]);
														break;	
													// }
												}
											
										}else{
											var majorBlk = tempODATAPreCheck[q].UPGRADE_ELEMENT.split("_");
											var lastItem = majorBlk[majorBlk.length-1];
											if(lastItem.length==32){
												majorBlk.pop();
												var CompmajorBlk = majorBlk.join("_");
												if(CompmajorBlk==datatempoModelUpgradeRecruitSM[a2].UPGRADE_ELEMENT){
													// if(oModelUpgradeRecruitData[a2].PRODUCT=="Succession Management"){
														tempODATAPreCheckFilter.push(tempODATAPreCheck[q]);
														break;	
													// }
												}
											}else{
												majorBlk.pop();
												majorBlk.pop();
												var CompmajorBlk = majorBlk.join("_");
												if(CompmajorBlk==datatempoModelUpgradeRecruitSM[a2].UPGRADE_ELEMENT){
													// if(oModelUpgradeRecruitData[a2].PRODUCT=="Succession Management"){
														tempODATAPreCheckFilter.push(tempODATAPreCheck[q]);
														break;	
													// }
												}
											}
										}
										
										
										
										
									}
								}  else if(me.getView().byId("ddlProd").getSelectedKey()=="PG"){
									for(var a2=0;a2<datatempoModelUpgradeRecruitPG.length;a2++){
										
										
									
										
										
										if(tempODATAPreCheck[q].UPGRADE_ELEMENT.indexOf("_")==-1){
										
												if(tempODATAPreCheck[q].UPGRADE_ELEMENT==datatempoModelUpgradeRecruitPG[a2].UPGRADE_ELEMENT){
													// if(oModelUpgradeRecruitData[a2].PRODUCT=="Performance and Goals"){
														tempODATAPreCheckFilter.push(tempODATAPreCheck[q]);
														break;	
													// }
												}
											
										}else{
											var majorBlk = tempODATAPreCheck[q].UPGRADE_ELEMENT.split("_");
											var lastItem = majorBlk[majorBlk.length-1];
											if(lastItem.length==32){
												majorBlk.pop();
												var CompmajorBlk = majorBlk.join("_");
												if(CompmajorBlk==datatempoModelUpgradeRecruitPG[a2].UPGRADE_ELEMENT){
													// if(oModelUpgradeRecruitData[a2].PRODUCT=="Performance and Goals"){
														tempODATAPreCheckFilter.push(tempODATAPreCheck[q]);
														break;	
													// }
												}
											}else{
												majorBlk.pop();
												majorBlk.pop();
												var CompmajorBlk = majorBlk.join("_");
												if(CompmajorBlk==datatempoModelUpgradeRecruitPG[a2].UPGRADE_ELEMENT){
													// if(oModelUpgradeRecruitData[a2].PRODUCT=="Performance and Goals"){
														tempODATAPreCheckFilter.push(tempODATAPreCheck[q]);
														break;	
													// }
												}
											}
										}
										
										
										
										
									}
								}  else if(me.getView().byId("ddlProd").getSelectedKey()=="CO"){
									for(var a2=0;a2<datatempoModelUpgradeRecruitCO.length;a2++){
										
									
			
										if(tempODATAPreCheck[q].UPGRADE_ELEMENT.indexOf("_")==-1){
											
										if(tempODATAPreCheck[q].UPGRADE_ELEMENT==datatempoModelUpgradeRecruitCO[a2].UPGRADE_ELEMENT){
											// if(oModelUpgradeRecruitData[a2].PRODUCT=="Compensation"){
												tempODATAPreCheckFilter.push(tempODATAPreCheck[q]);
												break;
											
											// }
											}
										
										}else{
											var majorBlk = tempODATAPreCheck[q].UPGRADE_ELEMENT.split("_");
											var lastItem = majorBlk[majorBlk.length-1];
											if(lastItem.length==32){
												majorBlk.pop();
												var CompmajorBlk = majorBlk.join("_");
												if(CompmajorBlk==datatempoModelUpgradeRecruitCO[a2].UPGRADE_ELEMENT){
													// if(oModelUpgradeRecruitData[a2].PRODUCT=="Compensation"){
														tempODATAPreCheckFilter.push(tempODATAPreCheck[q]);
														break;	
													// }
												}
											}else{
												majorBlk.pop();
												majorBlk.pop();
												var CompmajorBlk = majorBlk.join("_");
												if(CompmajorBlk==datatempoModelUpgradeRecruitCO[a2].UPGRADE_ELEMENT){
													// if(oModelUpgradeRecruitData[a2].PRODUCT=="Compensation"){
														tempODATAPreCheckFilter.push(tempODATAPreCheck[q]);
														break;	
													// }
												}
											}
										}
										
										
										
										
									}
								}  else if(me.getView().byId("ddlProd").getSelectedKey()=="ON"){
									for(var a2=0;a2<datatempoModelUpgradeRecruitON.length;a2++){
										
									
										
			
										if(tempODATAPreCheck[q].UPGRADE_ELEMENT.indexOf("_")==-1){
											
											if(tempODATAPreCheck[q].UPGRADE_ELEMENT==datatempoModelUpgradeRecruitON[a2].UPGRADE_ELEMENT){
											// if(oModelUpgradeRecruitData[a2].PRODUCT=="Onboarding" || oModelUpgradeRecruitData[a2].PRODUCT=="Onboarding 2.0"){
												tempODATAPreCheckFilter.push(tempODATAPreCheck[q]);
												break;
											// }
										}
										
											
										}else{
											var majorBlk = tempODATAPreCheck[q].UPGRADE_ELEMENT.split("_");
											var lastItem = majorBlk[majorBlk.length-1];
											if(lastItem.length==32){
												majorBlk.pop();
												var CompmajorBlk = majorBlk.join("_");
												if(CompmajorBlk==datatempoModelUpgradeRecruitON[a2].UPGRADE_ELEMENT){
													// if(oModelUpgradeRecruitData[a2].PRODUCT=="Onboarding" || oModelUpgradeRecruitData[a2].PRODUCT=="Onboarding 2.0"){
														tempODATAPreCheckFilter.push(tempODATAPreCheck[q]);
														break;	
													// }
												}
											}else{
												majorBlk.pop();
												majorBlk.pop();
												var CompmajorBlk = majorBlk.join("_");
												if(CompmajorBlk==datatempoModelUpgradeRecruitON[a2].UPGRADE_ELEMENT){
													// if(oModelUpgradeRecruitData[a2].PRODUCT=="Onboarding" || oModelUpgradeRecruitData[a2].PRODUCT=="Onboarding 2.0"){
														tempODATAPreCheckFilter.push(tempODATAPreCheck[q]);
														break;	
													// }
												}
											}
										}
										
										
										
									}
								}  else if(me.getView().byId("ddlProd").getSelectedKey()=="EC"){
									for(var a2=0; a2<datatempoModelUpgradeRecruitEC.length; a2++){
										
									// var datatempoModelUpgradeRecruitON = sap.ui.getCore().getModel("oModelUpgradeRecruitON").getData();
			// var datatempoModelUpgradeRecruitREC = sap.ui.getCore().getModel("oModelUpgradeRecruitREC").getData();
			// var datatempoModelUpgradeRecruitSM = sap.ui.getCore().getModel("oModelUpgradeRecruitSM").getData();
			// var datatempoModelUpgradeRecruitPG = sap.ui.getCore().getModel("oModelUpgradeRecruitPG").getData();
			// var datatempoModelUpgradeRecruitCO = sap.ui.getCore().getModel("oModelUpgradeRecruitCO").getData();
			// var datatempoModelUpgradeRecruitEC = sap.ui.getCore().getModel("oModelUpgradeRecruitEC").getData();
										
										
										if(tempODATAPreCheck[q].UPGRADE_ELEMENT.indexOf("_")==-1){
											
										
												if(tempODATAPreCheck[q].UPGRADE_ELEMENT==datatempoModelUpgradeRecruitEC[a2].UPGRADE_ELEMENT){
													// if(oModelUpgradeRecruitData[a2].PRODUCT=="Employee Central"){
														tempODATAPreCheckFilter.push(tempODATAPreCheck[q]);
														break;	
													// }
												}
											
										 
											
										}else{
											var majorBlk = tempODATAPreCheck[q].UPGRADE_ELEMENT.split("_");
											var lastItem = majorBlk[majorBlk.length-1];
											if(lastItem.length==32){
												majorBlk.pop();
												var CompmajorBlk = majorBlk.join("_");
												if(CompmajorBlk==datatempoModelUpgradeRecruitEC[a2].UPGRADE_ELEMENT){
													// if(datatempoModelUpgradeRecruitEC[a2].PRODUCT=="Employee Central"){
														tempODATAPreCheckFilter.push(tempODATAPreCheck[q]);
														break;	
													// }
												}
											}else{
												majorBlk.pop();
												majorBlk.pop();
												var CompmajorBlk = majorBlk.join("_");
												if(CompmajorBlk==datatempoModelUpgradeRecruitEC[a2].UPGRADE_ELEMENT){
													// if(oModelUpgradeRecruitData[a2].PRODUCT=="Employee Central"){
														tempODATAPreCheckFilter.push(tempODATAPreCheck[q]);
														break;	
													// }
												}
											}
										}
									}
								}
								}
							}
							if (tempODATAPreCheckFilter.length > 0) {
	
							var oModelVersion = new sap.ui.model.json.JSONModel();
							oModelVersion.setSizeLimit(1000);
							sap.ui.getCore().setModel(oModelVersion, "oModelVersion");
	
							var oModelCustomer = new sap.ui.model.json.JSONModel();
							oModelCustomer.setSizeLimit(1000);
							sap.ui.getCore().setModel(oModelCustomer, "oModelCustomer");
	
							var tempODATA = [];
							var tempdataRg = [];
							var tempTimeData = [];
							var custName = [];
							var custUsers = [];
	
							tempdataRg.push({
								version: "Build Version",
								versionPara: "Version"
							});
							var tempData = [];
							var count = 0;
							for (var q = 0; q < tempODATAPreCheckFilter.length; q++) {
								// if(tempODATAPreCheckFilter[q].COMPANY=="CRUZ ROJA ESPAÑOLA"){
								// 	tempODATAPreCheckFilter[q].COMPANY="CRUZ ROJA ESPAÑOLA DESARROLLO";
								// }
								// if(tempODATAPreCheckFilter[q].COMPANY=="Release"){
								// 	tempODATAPreCheckFilter[q].COMPANY="Stericycle Inc (de)";
								// }
								if(tempODATAPreCheckFilter[q].COMPANY!="BPMCINSTANCE4" && tempODATAPreCheckFilter[q].COMPANY!="BPMCINSTANCE1"){
									if (tempODATAPreCheckFilter[q].COMPANYSCHEMA != null && tempODATAPreCheckFilter[q].COMPANYSCHEMA.toLowerCase().indexOf("sfsales")==-1) {
									// if (tempODATAPreCheckFilter[q].COMPANYSCHEMA.toLowerCase().indexOf("sfv4") > -1 || tempODATAPreCheckFilter[q].COMPANYSCHEMA.toLowerCase().indexOf("hanapm") > -1 || tempODATAPreCheckFilter[q].COMPANYSCHEMA.toLowerCase().indexOf(
									// 		"stg") > -1 || tempODATAPreCheckFilter[q].COMPANYSCHEMA.toLowerCase().indexOf("stockpm172200_ref2") > -1 || tempODATAPreCheckFilter[q].COMPANYSCHEMA.toLowerCase().indexOf("dc") > -1) {
	
										if (tempODATAPreCheckFilter[q].RESULT == "true") {
											var stat = "Success";
										} else if (tempODATAPreCheckFilter[q].RESULT == "false") {
											var stat = "Failure";
										}
	
										if (tempODATAPreCheckFilter[q].UPGRADE_ELEMENT.split("Best Practice Configurations Employee Central")[1] == undefined) {
											if (tempODATAPreCheckFilter[q].UPGRADE_ELEMENT.split("bestpracticesEmployeeCentral")[1] == undefined) {
												// tempTimeData.push({
												// 	company: tempODATAPreCheckFilter[q].COMPANY,
												// 	result: stat,
												// 	upgrade:"EC "+tempODATAPreCheckFilter[q].UPGRADE_ELEMENT.split("Best Practices Employee Central")[1],
												// 	timestamp: tempODATAPreCheckFilter[q].TIME_STAMP.toDateString(),
												// 	puretimestamp: tempODATAPreCheckFilter[q].TIME_STAMP
												// });
												if (tempODATAPreCheckFilter[q].UPGRADE_ELEMENT.split("Best Practices Employee Central")[1] == undefined) {
													if (tempODATAPreCheckFilter[q].UPGRADE_ELEMENT.split("Best Practices")[1] == undefined) {
														if(tempODATAPreCheckFilter[q].UPGRADE_ELEMENT.split("Best Practice")[1]==undefined){
															tempTimeData.push({
																company: tempODATAPreCheckFilter[q].COMPANY,
																result: stat,
																upgrade: tempODATAPreCheckFilter[q].UPGRADE_ELEMENT,
																timestamp: tempODATAPreCheckFilter[q].TIME_STAMP.toUTCString(),//.toDateString(),
																puretimestamp: tempODATAPreCheckFilter[q].TIME_STAMP.toUTCString()
															});
														}else{
															tempTimeData.push({
																company: tempODATAPreCheckFilter[q].COMPANY,
																result: stat,
																upgrade: tempODATAPreCheckFilter[q].UPGRADE_ELEMENT.split("Best Practice")[1],
																timestamp: tempODATAPreCheckFilter[q].TIME_STAMP.toUTCString(),//.toDateString(),
																puretimestamp: tempODATAPreCheckFilter[q].TIME_STAMP.toUTCString()
															});
														}
													} else {
														if(tempODATAPreCheckFilter[q].UPGRADE_ELEMENT.indexOf("In-app learning")>-1){
															tempTimeData.push({
															company: tempODATAPreCheckFilter[q].COMPANY,
															result: stat,
															upgrade: tempODATAPreCheckFilter[q].UPGRADE_ELEMENT,
															timestamp: tempODATAPreCheckFilter[q].TIME_STAMP.toUTCString(),//.toDateString(),
															puretimestamp: tempODATAPreCheckFilter[q].TIME_STAMP.toUTCString()
														});
														}else{
															tempTimeData.push({
															company: tempODATAPreCheckFilter[q].COMPANY,
															result: stat,
															upgrade: tempODATAPreCheckFilter[q].UPGRADE_ELEMENT.split("Best Practices")[1],
															timestamp: tempODATAPreCheckFilter[q].TIME_STAMP.toUTCString(),//.toDateString(),
															puretimestamp: tempODATAPreCheckFilter[q].TIME_STAMP.toUTCString()
														});
														}
														
													}
												} else {
													tempTimeData.push({
														company: tempODATAPreCheckFilter[q].COMPANY,
														result: stat,
														upgrade: "EC " + tempODATAPreCheckFilter[q].UPGRADE_ELEMENT.split("Best Practices Employee Central")[1],
														timestamp: tempODATAPreCheckFilter[q].TIME_STAMP.toUTCString(),//.toDateString(),
														puretimestamp: tempODATAPreCheckFilter[q].TIME_STAMP.toUTCString()
													});
												}
											} else {
												tempTimeData.push({
													company: tempODATAPreCheckFilter[q].COMPANY,
													result: stat,
													upgrade: "EC " + tempODATAPreCheckFilter[q].UPGRADE_ELEMENT.split("bestpracticesEmployeeCentral")[1],
													timestamp: tempODATAPreCheckFilter[q].TIME_STAMP.toUTCString(),//.toDateString(),
													puretimestamp: tempODATAPreCheckFilter[q].TIME_STAMP.toUTCString()
												});
											}
										} else {
											tempTimeData.push({
												company: tempODATAPreCheckFilter[q].COMPANY,
												result: stat,
												upgrade: "EC " + tempODATAPreCheckFilter[q].UPGRADE_ELEMENT.split("Best Practice Configurations Employee Central")[1],
												timestamp: tempODATAPreCheckFilter[q].TIME_STAMP.toUTCString(),//.toDateString(),
												puretimestamp: tempODATAPreCheckFilter[q].TIME_STAMP.toUTCString()
											});
	
										}
	
										// tempTimeData.push({
										// 	company: tempODATAPreCheckFilter[q].COMPANY,
										// 	upgrade: tempODATAPreCheckFilter[q].UPGRADE_ELEMENT,
										// 	timestamp: tempODATAPreCheckFilter[q].TIME_STAMP.toDateString()
										// });
									// }
								}
								}
							}
	
							var tempTimeAry = [];
	
							for (var w = 0; w < unique.length; w++) {
								for (var z = 0; z < tempTimeData.length; z++) {
									if (unique[w] == tempTimeData[z].company) {
										tempTimeAry.push({
											val: unique[w],
											upgrade: [],
											upgradeDisplay: [],
											upgradeString: "",
											time: (tempTimeData[z].timestamp).split(' ', 4).join(' '),
											puretime: tempTimeData[z].puretimestamp
										});
										break;
									}
									//date = dateTime.split(' ', 4).join(' ');
									// if (unique[w] == tempTimeData[z].company) {
									// 	tempTimeAry.push({
									// 		upgrade:tempTimeData[z].upgrade,
									// 	});
									// }
								}
							}
	
							// for (var w = 0; w < tempTimeAry.length; w++) {
							// 	for (var z = 0; z < tempTimeData.length; z++) {
							// 		if (tempTimeAry[w].val == tempTimeData[z].company) {
							// 			tempTimeAry[w].upgrade.push(tempTimeData[z].upgrade);
							// 		}
							// 	}
							// }
	
							for (var w = 0; w < tempTimeAry.length; w++) {
								for (var z = 0; z < tempTimeData.length; z++) {
									if (tempTimeAry[w].val == tempTimeData[z].company) {
										if(tempTimeAry[w].upgrade.indexOf(tempTimeData[z].upgrade)==-1){
											
											tempTimeAry[w].upgrade.push(tempTimeData[z].upgrade);
											//tempTimeAry[w].upgradeDisplay.push(tempTimeData[z].upgrade + " - " +tempTimeData[z].result + " - " + tempTimeData[z].timestamp);
											tempTimeAry[w].upgradeDisplay.push(tempTimeData[z].upgrade + " - " + ((tempTimeData[z].timestamp).split(' ', 4).join(' ')).replace(","," "));
										}
									}
								}
							}
	
							var uniqueData = [];
							for (var w = 0; w < tempTimeAry.length; w++) {
								var tempODATA = tempTimeAry[w].upgrade;
	
								uniqueData.push({
									index: w,
									data: tempODATA.filter(function(itm, i, tempODATA) {
										return i == tempODATA.indexOf(itm);
									})
								});
	
							}
							for (var w = 0; w < tempTimeAry.length; w++) {
								tempTimeAry[w].upgrade = uniqueData[w].data;
							}
	
							var uniqueDataDisplay = [];
							for (var w = 0; w < tempTimeAry.length; w++) {
								var tempODATA = tempTimeAry[w].upgradeDisplay;
	
								uniqueDataDisplay.push({
									index: w,
									dataInput: [],
									data: tempODATA.filter(function(itm, i, tempODATA) {
										return i == tempODATA.indexOf(itm);
									})
								});
							}
	
							// for(var w=0;w<uniqueDataDisplay.length;w++){
							// 	var tempODATAInner = uniqueDataDisplay[w].data;
							// 	for(var i in tempODATAInner){
							// 		if(tempODATAInner[i]==1){
							// 			uniqueDataDisplay[w].dataInput.push(i+" - "+tempODATAInner[i]+" time");
							// 		}else{
							// 			uniqueDataDisplay[w].dataInput.push(i+" - "+tempODATAInner[i]+" times");	
							// 		}
	
							// 	}
							// }
	
							for (var w = 0; w < tempTimeAry.length; w++) {
	
								tempTimeAry[w].upgradeDisplay = uniqueDataDisplay[w].data;
							}
	
							for (var w = 0; w < tempTimeAry.length; w++) {
								tempTimeAry[w].upgradeString = tempTimeAry[w].upgrade.toString();
							}
	
							var oDataGrpUsers = {
								"stlistUser": tempTimeAry
							};
							oModelCustomer.setData(oDataGrpUsers);
							me.getView().byId("listTable").setModel(oModelCustomer);
	
						}
						}else{
							var oModelCustomer = new sap.ui.model.json.JSONModel();
							oModelCustomer.setSizeLimit(1000);
							sap.ui.getCore().setModel(oModelCustomer, "oModelCustomer");
	
							var oDataGrpUsers = {
								"stlistUser": []
							};
							oModelCustomer.setData(oDataGrpUsers);
							me.getView().byId("listTable").setModel(oModelCustomer);
						}
					},
					function(oError) {
						console.log("Error 127");
					});
			}
		
		},
		
		loadLineChart: function(mdl, para, fromCompDate, toCompDate) {

			var tempDate = [];
			var oDataCHSTLine = {};
			var inputFeedArry = [];
			var oModelLineChartSVAccDetail = new sap.ui.model.json.JSONModel();
			sap.ui.getCore().setModel(oModelLineChartSVAccDetail, "oModelLineChartSVAccDetail");
			var me = this;
			
			var tempODATAPreCheck = [];
			var tempODATAPreCheckFilter = [];
			// var oModelUpgradeRecruitData = sap.ui.getCore().getModel("oModelUpgradeRecruit").getData();
			
			var datatempoModelUpgradeRecruitON = sap.ui.getCore().getModel("oModelUpgradeRecruitON").getData();
			var datatempoModelUpgradeRecruitREC = sap.ui.getCore().getModel("oModelUpgradeRecruitREC").getData();
			var datatempoModelUpgradeRecruitSM = sap.ui.getCore().getModel("oModelUpgradeRecruitSM").getData();
			var datatempoModelUpgradeRecruitPG = sap.ui.getCore().getModel("oModelUpgradeRecruitPG").getData();
			var datatempoModelUpgradeRecruitCO = sap.ui.getCore().getModel("oModelUpgradeRecruitCO").getData();
			var datatempoModelUpgradeRecruitEC = sap.ui.getCore().getModel("oModelUpgradeRecruitEC").getData();
			
			var deployKey = me.getView().byId("ddlDeploy").getSelectedKey();

			if (para != "") {
				if(deployKey=="All"){
				var url =
					"/UpgradeCenterResult?$select=COMPANY,UPGRADE_ELEMENT,COMPANYSCHEMA,TIME_STAMP&$orderby=TIME_STAMP desc&$filter=(substringof('sfv4',COMPANYSCHEMA) or substringof('SFV4',COMPANYSCHEMA) or substringof('STOCKPM',COMPANYSCHEMA) or substringof('GLOBUSER_DVLHCM20S',COMPANYSCHEMA) or substringof('globuser_dvlhcm20s',COMPANYSCHEMA) or substringof('stockpm',COMPANYSCHEMA) or substringof('GLOBUSER_DVLHCM20S',COMPANYSCHEMA) or substringof('globuser_dvlhcm20s',COMPANYSCHEMA) or substringof('STOCKPM000110_REF2',COMPANYSCHEMA) or substringof('stockpm000110_ref2',COMPANYSCHEMA) or substringof('STOCKPM172200_REF2',COMPANYSCHEMA) or substringof('stockpm172200_ref2',COMPANYSCHEMA) or substringof('STOCKPM170737_REF',COMPANYSCHEMA) or substringof('stockpm170737_ref',COMPANYSCHEMA)    or substringof('DC',COMPANYSCHEMA) or substringof('dc',COMPANYSCHEMA) or substringof('STG',COMPANYSCHEMA) or substringof('stg',COMPANYSCHEMA) or substringof('HANAPM',COMPANYSCHEMA) or substringof('hanapm',COMPANYSCHEMA)) and COMPANYID ne 'PAYNGPPRL' and COMPANYID ne 'USBASEIAS22V1' and COMPANYID ne 'SAPSDCHXM0001' and COMPANYID ne 'PAYNGPPRLE' and COMPANYSCHEMA ne '' and COMPANY ne '' and COMPANY ne 'SAP SF Cloud Engineering' and FILEVERSION eq '" +
					para + "' and TIME_STAMP ge datetime'" + fromCompDate + "' and TIME_STAMP le datetime'" + toCompDate + "'";
				}else if(deployKey=="CUST"){
					var url =
					"/UpgradeCenterResult?$select=COMPANY,UPGRADE_ELEMENT,COMPANYSCHEMA,TIME_STAMP&$orderby=TIME_STAMP desc&$filter=(substringof('sfv4',COMPANYSCHEMA) or substringof('SFV4',COMPANYSCHEMA) or substringof('STOCKPM',COMPANYSCHEMA) or substringof('GLOBUSER_DVLHCM20S',COMPANYSCHEMA) or substringof('globuser_dvlhcm20s',COMPANYSCHEMA) or substringof('stockpm',COMPANYSCHEMA) or substringof('GLOBUSER_DVLHCM20S',COMPANYSCHEMA) or substringof('globuser_dvlhcm20s',COMPANYSCHEMA) or substringof('STOCKPM000110_REF2',COMPANYSCHEMA) or substringof('stockpm000110_ref2',COMPANYSCHEMA) or substringof('STOCKPM172200_REF2',COMPANYSCHEMA) or substringof('stockpm172200_ref2',COMPANYSCHEMA) or substringof('STOCKPM170737_REF',COMPANYSCHEMA) or substringof('stockpm170737_ref',COMPANYSCHEMA)    or substringof('DC',COMPANYSCHEMA) or substringof('dc',COMPANYSCHEMA) or substringof('STG',COMPANYSCHEMA) or substringof('stg',COMPANYSCHEMA) or substringof('HANAPM',COMPANYSCHEMA) or substringof('hanapm',COMPANYSCHEMA)) and substringof('_',UPGRADE_ELEMENT) and COMPANYID ne 'PAYNGPPRL' and COMPANYID ne 'USBASEIAS22V1' and COMPANYID ne 'SAPSDCHXM0001' and COMPANYID ne 'PAYNGPPRLE' and COMPANYSCHEMA ne '' and COMPANY ne '' and COMPANY ne 'SAP SF Cloud Engineering' and FILEVERSION eq '" +
					para + "' and TIME_STAMP ge datetime'" + fromCompDate + "' and TIME_STAMP le datetime'" + toCompDate + "'";
				}else{
				var url =
					"/UpgradeCenterResult?$select=COMPANY,UPGRADE_ELEMENT,COMPANYSCHEMA,TIME_STAMP&$orderby=TIME_STAMP desc&$filter=(substringof('sfv4',COMPANYSCHEMA) or substringof('SFV4',COMPANYSCHEMA) or substringof('STOCKPM',COMPANYSCHEMA) or substringof('GLOBUSER_DVLHCM20S',COMPANYSCHEMA) or substringof('globuser_dvlhcm20s',COMPANYSCHEMA) or substringof('stockpm',COMPANYSCHEMA) or substringof('GLOBUSER_DVLHCM20S',COMPANYSCHEMA) or substringof('globuser_dvlhcm20s',COMPANYSCHEMA) or substringof('STOCKPM000110_REF2',COMPANYSCHEMA) or substringof('stockpm000110_ref2',COMPANYSCHEMA) or substringof('STOCKPM172200_REF2',COMPANYSCHEMA) or substringof('stockpm172200_ref2',COMPANYSCHEMA) or substringof('STOCKPM170737_REF',COMPANYSCHEMA) or substringof('stockpm170737_ref',COMPANYSCHEMA)    or substringof('DC',COMPANYSCHEMA) or substringof('dc',COMPANYSCHEMA) or substringof('STG',COMPANYSCHEMA) or substringof('stg',COMPANYSCHEMA) or substringof('HANAPM',COMPANYSCHEMA) or substringof('hanapm',COMPANYSCHEMA)) and indexof(UPGRADE_ELEMENT,'_') eq -1  and COMPANYID ne 'PAYNGPPRL' and COMPANYID ne 'USBASEIAS22V1' and COMPANYID ne 'SAPSDCHXM0001' and COMPANYID ne 'PAYNGPPRLE' and COMPANYSCHEMA ne '' and COMPANY ne '' and COMPANY ne 'SAP SF Cloud Engineering' and FILEVERSION eq '" +
					para + "' and TIME_STAMP ge datetime'" + fromCompDate + "' and TIME_STAMP le datetime'" + toCompDate + "'";	
				}
				// var url =
				// 	"/UpgradeCenterResult?$select=COMPANY,COMPANYSCHEMA,TIME_STAMP&$orderby=TIME_STAMP desc&$filter=(substringof('sfv4',COMPANYSCHEMA) or substringof('SFV4',COMPANYSCHEMA) or substringof('stockpm',COMPANYSCHEMA) or substringof('GLOBUSER_DVLHCM20S',COMPANYSCHEMA) or substringof('globuser_dvlhcm20s',COMPANYSCHEMA) or substringof('stockpm',COMPANYSCHEMA) or substringof('GLOBUSER_DVLHCM20S',COMPANYSCHEMA) or substringof('globuser_dvlhcm20s',COMPANYSCHEMA) or substringof('STOCKPM000110_REF2',COMPANYSCHEMA) or substringof('stockpm000110_ref2',COMPANYSCHEMA) or substringof('STOCKPM172200_REF2',COMPANYSCHEMA) or substringof('stockpm172200_ref2',COMPANYSCHEMA) or substringof('STOCKPM170737_REF',COMPANYSCHEMA) or substringof('stockpm170737_ref',COMPANYSCHEMA)    or substringof('DC',COMPANYSCHEMA) or substringof('dc',COMPANYSCHEMA) or substringof('STG',COMPANYSCHEMA) or substringof('stg',COMPANYSCHEMA) or substringof('HANAPM',COMPANYSCHEMA) or substringof('hanapm',COMPANYSCHEMA)) and COMPANYID ne 'PAYNGPPRL' and COMPANYID ne 'USBASEIAS22V1' and COMPANYID ne 'SAPSDCHXM0001' and COMPANYID ne 'PAYNGPPRLE' and COMPANYSCHEMA ne '' and COMPANY ne '' and COMPANY ne 'SAP SF Cloud Engineering' and FILEVERSION eq '" +
				// 	para + "' and TIME_STAMP ge datetime'" + fromCompDate + "' and TIME_STAMP le datetime'" + toCompDate + "'";
			} else {
				if(deployKey=="All"){
				var url =
					"/UpgradeCenterResult?$select=COMPANY,UPGRADE_ELEMENT,COMPANYSCHEMA,TIME_STAMP&$orderby=TIME_STAMP desc&$filter=(substringof('sfv4',COMPANYSCHEMA) or substringof('SFV4',COMPANYSCHEMA) or substringof('STOCKPM',COMPANYSCHEMA) or substringof('GLOBUSER_DVLHCM20S',COMPANYSCHEMA) or substringof('globuser_dvlhcm20s',COMPANYSCHEMA) or substringof('stockpm',COMPANYSCHEMA) or substringof('GLOBUSER_DVLHCM20S',COMPANYSCHEMA) or substringof('globuser_dvlhcm20s',COMPANYSCHEMA) or substringof('STOCKPM000110_REF2',COMPANYSCHEMA) or substringof('stockpm000110_ref2',COMPANYSCHEMA) or substringof('STOCKPM172200_REF2',COMPANYSCHEMA) or substringof('stockpm172200_ref2',COMPANYSCHEMA) or substringof('STOCKPM170737_REF',COMPANYSCHEMA) or substringof('stockpm170737_ref',COMPANYSCHEMA)    or substringof('DC',COMPANYSCHEMA) or substringof('dc',COMPANYSCHEMA) or substringof('STG',COMPANYSCHEMA) or substringof('stg',COMPANYSCHEMA) or substringof('HANAPM',COMPANYSCHEMA) or substringof('hanapm',COMPANYSCHEMA)) and COMPANYID ne 'PAYNGPPRL' and COMPANYID ne 'USBASEIAS22V1' and COMPANYID ne 'SAPSDCHXM0001' and COMPANYID ne 'PAYNGPPRLE' and COMPANYSCHEMA ne '' and COMPANY ne '' and COMPANY ne 'SAP SF Cloud Engineering' and TIME_STAMP ge datetime'" +
					fromCompDate + "' and TIME_STAMP le datetime'" + toCompDate + "'";
				}else if(deployKey=="CUST"){
					var url =
					"/UpgradeCenterResult?$select=COMPANY,UPGRADE_ELEMENT,COMPANYSCHEMA,TIME_STAMP&$orderby=TIME_STAMP desc&$filter=(substringof('sfv4',COMPANYSCHEMA) or substringof('SFV4',COMPANYSCHEMA) or substringof('STOCKPM',COMPANYSCHEMA) or substringof('GLOBUSER_DVLHCM20S',COMPANYSCHEMA) or substringof('globuser_dvlhcm20s',COMPANYSCHEMA) or substringof('stockpm',COMPANYSCHEMA) or substringof('GLOBUSER_DVLHCM20S',COMPANYSCHEMA) or substringof('globuser_dvlhcm20s',COMPANYSCHEMA) or substringof('STOCKPM000110_REF2',COMPANYSCHEMA) or substringof('stockpm000110_ref2',COMPANYSCHEMA) or substringof('STOCKPM172200_REF2',COMPANYSCHEMA) or substringof('stockpm172200_ref2',COMPANYSCHEMA) or substringof('STOCKPM170737_REF',COMPANYSCHEMA) or substringof('stockpm170737_ref',COMPANYSCHEMA)    or substringof('DC',COMPANYSCHEMA) or substringof('dc',COMPANYSCHEMA) or substringof('STG',COMPANYSCHEMA) or substringof('stg',COMPANYSCHEMA) or substringof('HANAPM',COMPANYSCHEMA) or substringof('hanapm',COMPANYSCHEMA)) and substringof('_',UPGRADE_ELEMENT) and COMPANYID ne 'PAYNGPPRL' and COMPANYID ne 'USBASEIAS22V1' and COMPANYID ne 'SAPSDCHXM0001' and COMPANYID ne 'PAYNGPPRLE' and COMPANYSCHEMA ne '' and COMPANY ne '' and COMPANY ne 'SAP SF Cloud Engineering' and TIME_STAMP ge datetime'" +
					fromCompDate + "' and TIME_STAMP le datetime'" + toCompDate + "'";
				}else{
				var url =
					"/UpgradeCenterResult?$select=COMPANY,UPGRADE_ELEMENT,COMPANYSCHEMA,TIME_STAMP&$orderby=TIME_STAMP desc&$filter=(substringof('sfv4',COMPANYSCHEMA) or substringof('SFV4',COMPANYSCHEMA) or substringof('STOCKPM',COMPANYSCHEMA) or substringof('GLOBUSER_DVLHCM20S',COMPANYSCHEMA) or substringof('globuser_dvlhcm20s',COMPANYSCHEMA) or substringof('stockpm',COMPANYSCHEMA) or substringof('GLOBUSER_DVLHCM20S',COMPANYSCHEMA) or substringof('globuser_dvlhcm20s',COMPANYSCHEMA) or substringof('STOCKPM000110_REF2',COMPANYSCHEMA) or substringof('stockpm000110_ref2',COMPANYSCHEMA) or substringof('STOCKPM172200_REF2',COMPANYSCHEMA) or substringof('stockpm172200_ref2',COMPANYSCHEMA) or substringof('STOCKPM170737_REF',COMPANYSCHEMA) or substringof('stockpm170737_ref',COMPANYSCHEMA)    or substringof('DC',COMPANYSCHEMA) or substringof('dc',COMPANYSCHEMA) or substringof('STG',COMPANYSCHEMA) or substringof('stg',COMPANYSCHEMA) or substringof('HANAPM',COMPANYSCHEMA) or substringof('hanapm',COMPANYSCHEMA)) and indexof(UPGRADE_ELEMENT,'_') eq -1  and COMPANYID ne 'PAYNGPPRL' and COMPANYID ne 'USBASEIAS22V1' and COMPANYID ne 'SAPSDCHXM0001' and COMPANYID ne 'PAYNGPPRLE' and COMPANYSCHEMA ne '' and COMPANY ne '' and COMPANY ne 'SAP SF Cloud Engineering' and TIME_STAMP ge datetime'" +
					fromCompDate + "' and TIME_STAMP le datetime'" + toCompDate + "'";	
				}
				// var url =
				// 	"/UpgradeCenterResult?$select=COMPANY,COMPANYSCHEMA,TIME_STAMP&$orderby=TIME_STAMP desc&$filter=(substringof('sfv4',COMPANYSCHEMA) or substringof('SFV4',COMPANYSCHEMA) or substringof('stockpm',COMPANYSCHEMA) or substringof('GLOBUSER_DVLHCM20S',COMPANYSCHEMA) or substringof('globuser_dvlhcm20s',COMPANYSCHEMA) or substringof('stockpm',COMPANYSCHEMA) or substringof('GLOBUSER_DVLHCM20S',COMPANYSCHEMA) or substringof('globuser_dvlhcm20s',COMPANYSCHEMA) or substringof('STOCKPM000110_REF2',COMPANYSCHEMA) or substringof('stockpm000110_ref2',COMPANYSCHEMA) or substringof('STOCKPM172200_REF2',COMPANYSCHEMA) or substringof('stockpm172200_ref2',COMPANYSCHEMA) or substringof('STOCKPM170737_REF',COMPANYSCHEMA) or substringof('stockpm170737_ref',COMPANYSCHEMA)    or substringof('DC',COMPANYSCHEMA) or substringof('dc',COMPANYSCHEMA) or substringof('STG',COMPANYSCHEMA) or substringof('stg',COMPANYSCHEMA) or substringof('HANAPM',COMPANYSCHEMA) or substringof('hanapm',COMPANYSCHEMA)) and COMPANYID ne 'PAYNGPPRL' and COMPANYID ne 'USBASEIAS22V1' and COMPANYID ne 'SAPSDCHXM0001' and COMPANYID ne 'PAYNGPPRLE' and COMPANYSCHEMA ne '' and COMPANY ne '' and COMPANY ne 'SAP SF Cloud Engineering' and TIME_STAMP ge datetime'" +
				// 	fromCompDate + "' and TIME_STAMP le datetime'" + toCompDate + "'";
			}

			mdl.read(
				url,
				null, null, true,
				function(oData, oResponse) {
					if(oData.results.length>0){
						tempODATAPreCheck = oData.results;
						// tempODATAPreCheckFilter = tempODATAPreCheck;
						
						for(var q=0;q<tempODATAPreCheck.length;q++){
							var majorBlk = tempODATAPreCheck[q].UPGRADE_ELEMENT.split("_");
							var lastItem = majorBlk[majorBlk.length-1];
							if(lastItem.length!=32){
									if(me.getView().byId("ddlProd").getSelectedKey()=="All"){
								
									
										tempODATAPreCheckFilter.push(tempODATAPreCheck[q]);
									}  else if(me.getView().byId("ddlProd").getSelectedKey()=="RM"){
				
										for(var a2=0;a2<datatempoModelUpgradeRecruitREC.length;a2++){
											
											if(tempODATAPreCheck[q].UPGRADE_ELEMENT.indexOf("_")==-1){
												
											
												if(tempODATAPreCheck[q].UPGRADE_ELEMENT==datatempoModelUpgradeRecruitREC[a2].UPGRADE_ELEMENT){
														// if(datatempoModelUpgradeRecruitREC[a2].PRODUCT=="Recruiting"){
															tempODATAPreCheckFilter.push(tempODATAPreCheck[q]);
															break;	
														// }
													}
												
											}else{
												var majorBlk = tempODATAPreCheck[q].UPGRADE_ELEMENT.split("_");
												var lastItem = majorBlk[majorBlk.length-1];
												if(lastItem.length==32){
													majorBlk.pop();
													var CompmajorBlk = majorBlk.join("_");
													if(CompmajorBlk==datatempoModelUpgradeRecruitREC[a2].UPGRADE_ELEMENT){
														// if(datatempoModelUpgradeRecruitREC[a2].PRODUCT=="Recruiting"){
															tempODATAPreCheckFilter.push(tempODATAPreCheck[q]);
															break;	
														// }
													}
												}else{
													majorBlk.pop();
													majorBlk.pop();
													var CompmajorBlk = majorBlk.join("_");
													if(CompmajorBlk==datatempoModelUpgradeRecruitREC[a2].UPGRADE_ELEMENT){
														// if(datatempoModelUpgradeRecruitREC[a2].PRODUCT=="Recruiting"){
															tempODATAPreCheckFilter.push(tempODATAPreCheck[q]);
															break;	
														// }
													}
												}
											}
											
											
											
											
											
										}
									}  else if(me.getView().byId("ddlProd").getSelectedKey()=="SM"){
										for(var a2=0;a2<datatempoModelUpgradeRecruitSM.length;a2++){
											
				// 							
											
											
												if(tempODATAPreCheck[q].UPGRADE_ELEMENT.indexOf("_")==-1){
													
											
												if(tempODATAPreCheck[q].UPGRADE_ELEMENT==datatempoModelUpgradeRecruitSM[a2].UPGRADE_ELEMENT){
														// if(oModelUpgradeRecruitData[a2].PRODUCT=="Succession Management"){
															tempODATAPreCheckFilter.push(tempODATAPreCheck[q]);
															break;	
														// }
													}
												
											}else{
												var majorBlk = tempODATAPreCheck[q].UPGRADE_ELEMENT.split("_");
												var lastItem = majorBlk[majorBlk.length-1];
												if(lastItem.length==32){
													majorBlk.pop();
													var CompmajorBlk = majorBlk.join("_");
													if(CompmajorBlk==datatempoModelUpgradeRecruitSM[a2].UPGRADE_ELEMENT){
														// if(oModelUpgradeRecruitData[a2].PRODUCT=="Succession Management"){
															tempODATAPreCheckFilter.push(tempODATAPreCheck[q]);
															break;	
														// }
													}
												}else{
													majorBlk.pop();
													majorBlk.pop();
													var CompmajorBlk = majorBlk.join("_");
													if(CompmajorBlk==datatempoModelUpgradeRecruitSM[a2].UPGRADE_ELEMENT){
														// if(oModelUpgradeRecruitData[a2].PRODUCT=="Succession Management"){
															tempODATAPreCheckFilter.push(tempODATAPreCheck[q]);
															break;	
														// }
													}
												}
											}
											
											
											
											
										}
									}  else if(me.getView().byId("ddlProd").getSelectedKey()=="PG"){
										for(var a2=0;a2<datatempoModelUpgradeRecruitPG.length;a2++){
											
											
										
											
											
											if(tempODATAPreCheck[q].UPGRADE_ELEMENT.indexOf("_")==-1){
											
													if(tempODATAPreCheck[q].UPGRADE_ELEMENT==datatempoModelUpgradeRecruitPG[a2].UPGRADE_ELEMENT){
														// if(oModelUpgradeRecruitData[a2].PRODUCT=="Performance and Goals"){
															tempODATAPreCheckFilter.push(tempODATAPreCheck[q]);
															break;	
														// }
													}
												
											}else{
												var majorBlk = tempODATAPreCheck[q].UPGRADE_ELEMENT.split("_");
												var lastItem = majorBlk[majorBlk.length-1];
												if(lastItem.length==32){
													majorBlk.pop();
													var CompmajorBlk = majorBlk.join("_");
													if(CompmajorBlk==datatempoModelUpgradeRecruitPG[a2].UPGRADE_ELEMENT){
														// if(oModelUpgradeRecruitData[a2].PRODUCT=="Performance and Goals"){
															tempODATAPreCheckFilter.push(tempODATAPreCheck[q]);
															break;	
														// }
													}
												}else{
													majorBlk.pop();
													majorBlk.pop();
													var CompmajorBlk = majorBlk.join("_");
													if(CompmajorBlk==datatempoModelUpgradeRecruitPG[a2].UPGRADE_ELEMENT){
														// if(oModelUpgradeRecruitData[a2].PRODUCT=="Performance and Goals"){
															tempODATAPreCheckFilter.push(tempODATAPreCheck[q]);
															break;	
														// }
													}
												}
											}
											
											
											
											
										}
									}  else if(me.getView().byId("ddlProd").getSelectedKey()=="CO"){
										for(var a2=0;a2<datatempoModelUpgradeRecruitCO.length;a2++){
											
										
				
											if(tempODATAPreCheck[q].UPGRADE_ELEMENT.indexOf("_")==-1){
												
											if(tempODATAPreCheck[q].UPGRADE_ELEMENT==datatempoModelUpgradeRecruitCO[a2].UPGRADE_ELEMENT){
												// if(oModelUpgradeRecruitData[a2].PRODUCT=="Compensation"){
													tempODATAPreCheckFilter.push(tempODATAPreCheck[q]);
													break;
												
												// }
												}
											
											}else{
												var majorBlk = tempODATAPreCheck[q].UPGRADE_ELEMENT.split("_");
												var lastItem = majorBlk[majorBlk.length-1];
												if(lastItem.length==32){
													majorBlk.pop();
													var CompmajorBlk = majorBlk.join("_");
													if(CompmajorBlk==datatempoModelUpgradeRecruitCO[a2].UPGRADE_ELEMENT){
														// if(oModelUpgradeRecruitData[a2].PRODUCT=="Compensation"){
															tempODATAPreCheckFilter.push(tempODATAPreCheck[q]);
															break;	
														// }
													}
												}else{
													majorBlk.pop();
													majorBlk.pop();
													var CompmajorBlk = majorBlk.join("_");
													if(CompmajorBlk==datatempoModelUpgradeRecruitCO[a2].UPGRADE_ELEMENT){
														// if(oModelUpgradeRecruitData[a2].PRODUCT=="Compensation"){
															tempODATAPreCheckFilter.push(tempODATAPreCheck[q]);
															break;	
														// }
													}
												}
											}
											
											
											
											
										}
									}  else if(me.getView().byId("ddlProd").getSelectedKey()=="ON"){
										for(var a2=0;a2<datatempoModelUpgradeRecruitON.length;a2++){
											
										
											
				
											if(tempODATAPreCheck[q].UPGRADE_ELEMENT.indexOf("_")==-1){
												
												if(tempODATAPreCheck[q].UPGRADE_ELEMENT==datatempoModelUpgradeRecruitON[a2].UPGRADE_ELEMENT){
												// if(oModelUpgradeRecruitData[a2].PRODUCT=="Onboarding" || oModelUpgradeRecruitData[a2].PRODUCT=="Onboarding 2.0"){
													tempODATAPreCheckFilter.push(tempODATAPreCheck[q]);
													break;
												// }
											}
											
												
											}else{
												var majorBlk = tempODATAPreCheck[q].UPGRADE_ELEMENT.split("_");
												var lastItem = majorBlk[majorBlk.length-1];
												if(lastItem.length==32){
													majorBlk.pop();
													var CompmajorBlk = majorBlk.join("_");
													if(CompmajorBlk==datatempoModelUpgradeRecruitON[a2].UPGRADE_ELEMENT){
														// if(oModelUpgradeRecruitData[a2].PRODUCT=="Onboarding" || oModelUpgradeRecruitData[a2].PRODUCT=="Onboarding 2.0"){
															tempODATAPreCheckFilter.push(tempODATAPreCheck[q]);
															break;	
														// }
													}
												}else{
													majorBlk.pop();
													majorBlk.pop();
													var CompmajorBlk = majorBlk.join("_");
													if(CompmajorBlk==datatempoModelUpgradeRecruitON[a2].UPGRADE_ELEMENT){
														// if(oModelUpgradeRecruitData[a2].PRODUCT=="Onboarding" || oModelUpgradeRecruitData[a2].PRODUCT=="Onboarding 2.0"){
															tempODATAPreCheckFilter.push(tempODATAPreCheck[q]);
															break;	
														// }
													}
												}
											}
											
											
											
										}
									}  else if(me.getView().byId("ddlProd").getSelectedKey()=="EC"){
										for(var a2=0; a2<datatempoModelUpgradeRecruitEC.length; a2++){
											
										// var datatempoModelUpgradeRecruitON = sap.ui.getCore().getModel("oModelUpgradeRecruitON").getData();
				// var datatempoModelUpgradeRecruitREC = sap.ui.getCore().getModel("oModelUpgradeRecruitREC").getData();
				// var datatempoModelUpgradeRecruitSM = sap.ui.getCore().getModel("oModelUpgradeRecruitSM").getData();
				// var datatempoModelUpgradeRecruitPG = sap.ui.getCore().getModel("oModelUpgradeRecruitPG").getData();
				// var datatempoModelUpgradeRecruitCO = sap.ui.getCore().getModel("oModelUpgradeRecruitCO").getData();
				// var datatempoModelUpgradeRecruitEC = sap.ui.getCore().getModel("oModelUpgradeRecruitEC").getData();
											
											
											if(tempODATAPreCheck[q].UPGRADE_ELEMENT.indexOf("_")==-1){
												
											
													if(tempODATAPreCheck[q].UPGRADE_ELEMENT==datatempoModelUpgradeRecruitEC[a2].UPGRADE_ELEMENT){
														// if(oModelUpgradeRecruitData[a2].PRODUCT=="Employee Central"){
															tempODATAPreCheckFilter.push(tempODATAPreCheck[q]);
															break;	
														// }
													}
												
											 
												
											}else{
												var majorBlk = tempODATAPreCheck[q].UPGRADE_ELEMENT.split("_");
												var lastItem = majorBlk[majorBlk.length-1];
												if(lastItem.length==32){
													majorBlk.pop();
													var CompmajorBlk = majorBlk.join("_");
													if(CompmajorBlk==datatempoModelUpgradeRecruitEC[a2].UPGRADE_ELEMENT){
														// if(datatempoModelUpgradeRecruitEC[a2].PRODUCT=="Employee Central"){
															tempODATAPreCheckFilter.push(tempODATAPreCheck[q]);
															break;	
														// }
													}
												}else{
													majorBlk.pop();
													majorBlk.pop();
													var CompmajorBlk = majorBlk.join("_");
													if(CompmajorBlk==datatempoModelUpgradeRecruitEC[a2].UPGRADE_ELEMENT){
														// if(oModelUpgradeRecruitData[a2].PRODUCT=="Employee Central"){
															tempODATAPreCheckFilter.push(tempODATAPreCheck[q]);
															break;	
														// }
													}
												}
											}
										}
									}
								}
						}	
							
						if (tempODATAPreCheckFilter.length > 0) {
						for (var w = 0; w < tempODATAPreCheckFilter.length; w++) {
							// if(tempODATAPreCheckFilter[w].COMPANY=="CRUZ ROJA ESPAÑOLA"){
							// 	tempODATAPreCheckFilter[w].COMPANY="CRUZ ROJA ESPAÑOLA DESARROLLO";
							// }
							// if(tempODATAPreCheckFilter[w].COMPANY=="Release"){
							// 	tempODATAPreCheckFilter[w].COMPANY="Stericycle Inc (de)";
							// }
							
							var majorBlk = tempODATAPreCheckFilter[w].UPGRADE_ELEMENT.split("_");
							var lastItem = majorBlk[majorBlk.length-1];
							if(lastItem.length!=32){
								
							if(tempODATAPreCheckFilter[w].COMPANY!="BPMCINSTANCE4" && tempODATAPreCheckFilter[w].COMPANY!="BPMCINSTANCE1"){
								if (tempODATAPreCheckFilter[w].COMPANYSCHEMA != null && tempODATAPreCheckFilter[w].COMPANYSCHEMA.toLowerCase().indexOf("sfsales")==-1) {
								// if (tempODATAPreCheckFilter[w].COMPANYSCHEMA.toLowerCase().indexOf("sfv4") > -1 || tempODATAPreCheckFilter[w].COMPANYSCHEMA.toLowerCase().indexOf("hanapm") > -1 || tempODATAPreCheckFilter[w].COMPANYSCHEMA.toLowerCase().indexOf(
								// 		"stg") > -1 || tempODATAPreCheckFilter[w].COMPANYSCHEMA.toLowerCase().indexOf("stockpm172200_ref2") > -1  || tempODATAPreCheckFilter[w].COMPANYSCHEMA.toLowerCase().indexOf("dc") > -1) {
									tempDate.push({
										comp: tempODATAPreCheckFilter[w].COMPANY + GetDDMMYY(new Date(tempODATAPreCheckFilter[w].TIME_STAMP.toUTCString())),
										cmpny: tempODATAPreCheckFilter[w].COMPANY,
										time: GetDDMMYY(new Date(tempODATAPreCheckFilter[w].TIME_STAMP.toUTCString())),
										timeComp: GetDDMM(new Date(tempODATAPreCheckFilter[w].TIME_STAMP.toUTCString())),
										pertimestamp: tempODATAPreCheckFilter[w].TIME_STAMP.toUTCString()
											// upgrade: tempODATAPreCheckFilter[w].UPGRADE_ELEMENT
									});
								// }
							}
							}
							}
						}

						var tempDatetempDate = tempDate.reduce(function(item, e1) {
							var matches = item.filter(function(e2) {
								if (e1.cmpny == e2.cmpny && e1.timeComp == e2.timeComp) {
									return e1.cmpny == e2.cmpny;
								}
							});
							if (matches.length == 0) {
								item.push(e1);
							}
							return item;
						}, []);

						var uniqueArray = me.removeDuplicates(tempDatetempDate, "cmpny");

						var output = [];

						uniqueArray.forEach(function(value) {
							var existing = output.filter(function(v, i) {
								return v.timeComp == value.timeComp;
							});

							if (existing.length) {
								var existingIndex = output.indexOf(existing[0]);
								output[existingIndex].cmpny = output[existingIndex].cmpny.concat(value.cmpny);
								output[existingIndex].time = output[existingIndex].time.concat(value.time);
							} else {
								if (typeof value.cmpny == 'string') {
									value.cmpny = [value.cmpny];
								}
								if (typeof value.time == 'string') {
									value.time = [value.time];
								}
								output.push(value);
							}
						});

						output.sort(function(a, b) {
							return (new Date(a.timeComp) > new Date(b.timeComp)) ? 1 : ((new Date(b.timeComp) > new Date(a.timeComp)) ? -1 : 0);
						});

						for (var w = 0; w < output.length; w++) {
							if (w == 0) {
								inputFeedArry.push({
									time: output[w].timeComp,
									cmpny: output[w].cmpny.length,
									commu: output[w].cmpny.length,
								});
							} else {
								inputFeedArry.push({
									time: output[w].timeComp,
									cmpny: output[w].cmpny.length,
									commu: inputFeedArry[w - 1].commu + output[w].cmpny.length,
								});
							}
						}

						oDataCHSTLine = {
							data: inputFeedArry
						};

						var oModelLineChartSVAccDetail = sap.ui.getCore().getModel("oModelLineChartSVAccDetail");
						oModelLineChartSVAccDetail.setData(oDataCHSTLine);

						var timeInput = [];
						var cmpnyInput = [];
						var commuInput = [];

						for (var t = 0; t < inputFeedArry.length; t++) {
							timeInput.push(inputFeedArry[t].time);
							cmpnyInput.push(inputFeedArry[t].cmpny);
							commuInput.push(inputFeedArry[t].commu);
						}

						// Highcharts.setOptions({
						// 	colors: Highcharts.map(['#f0ab00', '#6586AD'], function (color) {
						// 	    return {
						// 	        linearGradient: {
						// 	            cx: 0.5,
						// 	            cy: 0.3,
						// 	            r: 0.7
						// 	        },
						// 	        stops: [
						// 	            [0, color],
						// 	            [1, Highcharts.Color(color).brighten(-0.3).get('rgb')] // darken
						// 	        ]
						// 	    };
						// 	})
						// });

						// Highcharts.SVGRenderer.prototype.symbols.download = function (x, y, w, h) {
						//     var path = [
						//         // Arrow stem
						//         'M', x + w * 0.5, y,
						//         'L', x + w * 0.5, y + h * 0.7,
						//         // Arrow head
						//         'M', x + w * 0.3, y + h * 0.5,
						//         'L', x + w * 0.5, y + h * 0.7,
						//         'L', x + w * 0.7, y + h * 0.5,
						//         // Box
						//         'M', x, y + h * 0.9,
						//         'L', x, y + h,
						//         'L', x + w, y + h,
						//         'L', x + w, y + h * 0.9
						//     ];
						//     return path;
						// };

						// var chartArea = Highcharts.chart('repoContainerReviewArea', {
						//     chart: {
						//         type: 'areaspline',
						//         height:'330',
						//         width:'510',
						//         plotBackgroundColor: "transparent",
						//         plotBorderWidth: null,
						//         plotShadow: false
						//     },
						//     title: {
						//         text: ''
						//     },
						//     legend: {
						//     	itemStyle: {
						//             color: '#ddd',
						//         },
						//         itemDistance: 50
						//     },
						//     xAxis: {
						//     	labels: {
						//             style: {
						//                 color: '#ddd'
						//             }
						//         },
						//         // categories: timeInput,
						//         categories: [],
						//         tickColor: 'transparent'
						//     },
						//     yAxis: {
						//         title: {
						//             text: ''
						//         },
						//         labels: {
						//             style: {
						//                 color: '#ddd'
						//             }
						//         },
						//         gridLineColor: 'transparent'
						//     },
						//     tooltip: {
						//         shared: true,
						//         valueSuffix: ' Customers'
						//     },
						//     credits: {
						//         enabled: false
						//     },
						//     plotOptions: {
						//         series: {
						//             fillColor: {
						//                 linearGradient: [0, 0, 0, 300],
						//                 stops: [
						//                     [0, '#f0ab00'],
						//                     [1, Highcharts.Color("#D2E6F8").setOpacity(0).get('rgba')]
						//                 ]
						//             },
						//             dataLabels: {
						// 	            align: 'center',
						// 	            enabled: true,
						// 	            color: '#ddd'
						// 	        }
						//         }
						//     },
						//     // series: [ {
						//     //     name: 'Cumulative',
						//     //     data: commuInput
						//     // },{
						//     //     name: 'Count',
						//     //     data: cmpnyInput
						//     // }],
						//     series: [],
						//     navigation: {
						//         buttonOptions: {
						//             verticalAlign: 'top',
						//             x:10,
						//             y:-10
						//         },
						//         menuStyle: {
						//             background: '#555'
						//         },
						//         menuItemStyle: {
						//             color: '#ddd'
						//         }
						//     },
						//     exporting: {
						//      	chartOptions: {
						// 		    chart: {
						// 		      backgroundColor: '#555'
						// 		    }
						// 		  },
						//         buttons: {
						//             contextButton: {
						//                 symbol: 'download',
						//                 symbolFill: '#555'
						//             }
						//         },
						//         filename: 'Adoption Chart'
						//     }

						// });

						me.callRefChart(mdl, para, output);

						// var oVizFrame = me.getView().byId("AreaDetailLineChartDir");

						// oVizFrame.destroyFeeds();

						// var oDataset = new sap.viz.ui5.data.FlattenedDataset({
						// 	dimensions: [{
						// 		name: "Element",
						// 		value: "{time}"

						// 	}],
						// 	measures: [{
						// 		name: "Count",
						// 		value: "{cmpny}"
						// 	},
						// 	{
						// 		name: "Cumulative",
						// 		value: "{commu}"
						// 	}],

						// 	data: {
						// 		path: "/data"
						// 	}
						// });

						// oVizFrame.setDataset(oDataset);
						// oVizFrame.setModel(oModelLineChartSVAccDetail);

						// var feedValueAxis = new sap.viz.ui5.controls.common.feeds.FeedItem({
						// 	'uid': "valueAxis",
						// 	'type': "Measure",
						// 	'values': ["Count","Cumulative"]
						// });
						// // var feedValueAxis2 = new sap.viz.ui5.controls.common.feeds.FeedItem({
						// // 	'uid': "valueAxis2",
						// // 	'type': "Measure",
						// // 	'values': ["Cumulative"]
						// // });
						// var feedCategoryAxis = new sap.viz.ui5.controls.common.feeds.FeedItem({
						// 	'uid': "categoryAxis",
						// 	'type': "Dimension",
						// 	'values': ["Element"]
						// });
						// oVizFrame.addFeed(feedValueAxis);
						// // oVizFrame.addFeed(feedValueAxis2);
						// oVizFrame.addFeed(feedCategoryAxis);

						// oVizFrame.setVizProperties({
						// 	plotArea: {
						// 		dataLabel: {
						// 			// formatString:formatPattern.SHORTFLOAT_MFD2,
						// 			visible: true,
						// 			style: {
						// 				color: "#fff"
						// 			}
						// 		},
						// 		colorPalette: ['#529726', '#f0ab00'],
						// 		gridline: {
						// 			visible: false
						// 		}
						// 	},
						// 	general: {
						// 		background: {
						// 			color: "transparent"
						// 		},
						// 	},
						// 	valueAxis: {
						// 		label: {
						// 			style: {
						// 				color: "#ddd"
						// 			}
						// 			// formatString: formatPattern.SHORTFLOAT
						// 		},
						// 		title: {
						// 			visible: false
						// 		},
						// 	},
						// 	// valueAxis2: {
						// 	// 	label: {
						// 	// 		style: {
						// 	// 			color: "#ddd"
						// 	// 		}
						// 	// 		// formatString: formatPattern.SHORTFLOAT
						// 	// 	},
						// 	// 	title: {
						// 	// 		visible: false
						// 	// 	},
						// 	// },
						// 	categoryAxis: {
						// 		title: {
						// 			visible: false
						// 		},
						// 		label: {
						// 			style: {
						// 				color: "#ddd"
						// 			}
						// 		},
						// 		hoverShadow: {
						// 			color: "#000"
						// 		},
						// 		mouseDownShadow: {
						// 			color: "#7b7878"
						// 		}
						// 	},
						// 	title: {
						// 		visible: false,
						// 		text: ' '
						// 	},
						// 	legend: {
						// 		drawingEffect: 'glossy',
						// 		label: {
						// 			style: {
						// 				color: "#ddd"
						// 			}
						// 		},
						// 		hoverShadow: {
						// 			color: "#000"
						// 		},
						// 		mouseDownShadow: {
						// 			color: "#7b7878"
						// 		}
						// 	},
						// 	legendGroup : {
						// 	  layout : {
						// 			position : 'bottom'
						// 			// maxWidth : 100,
						// 	        // alignment : 'center'
						// 	    }
						// 	}
						// });
						// // oVizFrame.setLegendVisible(false);
					}
					}else{
						var oDataCHSTLine = {
							data: []
						};

						var oModelLineChartSVAccDetail = sap.ui.getCore().getModel("oModelLineChartSVAccDetail");
						oModelLineChartSVAccDetail.setData(oDataCHSTLine);
						
						me.callRefChart(mdl, para, []);
							
					}
				},
				function(oError) {
					// console.log("Error 127");
				});
		},

		callRefChart: function(mdl, para, output) {
			var oModelDetailOutput = new sap.ui.model.json.JSONModel();
			oModelDetailOutput.setData(output);
			sap.ui.getCore().setModel(oModelDetailOutput, "oModelDetailOutput");

			var Datetoday = new Date();
			var fromDate = new Date();
			fromDate.setMonth((fromDate.getMonth() - 60));
			fromDate.setDate(fromDate.getDate() + 1);
			
			// if(fromDate.getDate()!=1){
			// 	fromDate.setDate(1);
			// }

			var fromCompDateAll = fromDate.toISOString();
			var toCompDateTemp = Datetoday.toISOString();

			fromCompDateAll = fromCompDateAll.split("T")[0] + "T00:00";
			toCompDateTemp = toCompDateTemp.split("T")[0] + "T24:00";
			var tempDateTo = (new Date(toCompDateTemp)).getDate();
			var d = new Date(toCompDateTemp);
			d.setDate(tempDateTo);
			var toCompDateAll = d.toISOString();
			toCompDateAll = toCompDateAll.split("T")[0] + "T24:00";

			var tempDateRef = [];
			var oDataCHSTLineRef = {};
			var inputFeedArryRef = [];
			var oModelLineChartSVAccDetailRef = new sap.ui.model.json.JSONModel();
			sap.ui.getCore().setModel(oModelLineChartSVAccDetailRef, "oModelLineChartSVAccDetailRef");
			var me = this;
			
			var tempODATAPreCheck = [];
			var tempODATAPreCheckFilter = [];
			// var oModelUpgradeRecruitData = sap.ui.getCore().getModel("oModelUpgradeRecruit").getData();
			
			var datatempoModelUpgradeRecruitON = sap.ui.getCore().getModel("oModelUpgradeRecruitON").getData();
			var datatempoModelUpgradeRecruitREC = sap.ui.getCore().getModel("oModelUpgradeRecruitREC").getData();
			var datatempoModelUpgradeRecruitSM = sap.ui.getCore().getModel("oModelUpgradeRecruitSM").getData();
			var datatempoModelUpgradeRecruitPG = sap.ui.getCore().getModel("oModelUpgradeRecruitPG").getData();
			var datatempoModelUpgradeRecruitCO = sap.ui.getCore().getModel("oModelUpgradeRecruitCO").getData();
			var datatempoModelUpgradeRecruitEC = sap.ui.getCore().getModel("oModelUpgradeRecruitEC").getData();
			
			
			
			var oModelUpgradeRefDataData = sap.ui.getCore().getModel("oModelUpgradeRefData").getData();
			
			if(oModelUpgradeRefDataData.length>0){
				
				tempODATAPreCheck = oModelUpgradeRefDataData;
						// tempODATAPreCheckFilter = tempODATAPreCheck;
						
						for(var q=0;q<tempODATAPreCheck.length;q++){
							var majorBlk = tempODATAPreCheck[q].UPGRADE_ELEMENT.split("_");
							var lastItem = majorBlk[majorBlk.length-1];
							if(lastItem.length!=32){
									if(me.getView().byId("ddlProd").getSelectedKey()=="All"){
								
									
										tempODATAPreCheckFilter.push(tempODATAPreCheck[q]);
									}  else if(me.getView().byId("ddlProd").getSelectedKey()=="RM"){
				
										for(var a2=0;a2<datatempoModelUpgradeRecruitREC.length;a2++){
											
											if(tempODATAPreCheck[q].UPGRADE_ELEMENT.indexOf("_")==-1){
												
											
												if(tempODATAPreCheck[q].UPGRADE_ELEMENT==datatempoModelUpgradeRecruitREC[a2].UPGRADE_ELEMENT){
														// if(datatempoModelUpgradeRecruitREC[a2].PRODUCT=="Recruiting"){
															tempODATAPreCheckFilter.push(tempODATAPreCheck[q]);
															break;	
														// }
													}
												
											}else{
												var majorBlk = tempODATAPreCheck[q].UPGRADE_ELEMENT.split("_");
												var lastItem = majorBlk[majorBlk.length-1];
												if(lastItem.length==32){
													majorBlk.pop();
													var CompmajorBlk = majorBlk.join("_");
													if(CompmajorBlk==datatempoModelUpgradeRecruitREC[a2].UPGRADE_ELEMENT){
														// if(datatempoModelUpgradeRecruitREC[a2].PRODUCT=="Recruiting"){
															tempODATAPreCheckFilter.push(tempODATAPreCheck[q]);
															break;	
														// }
													}
												}else{
													majorBlk.pop();
													majorBlk.pop();
													var CompmajorBlk = majorBlk.join("_");
													if(CompmajorBlk==datatempoModelUpgradeRecruitREC[a2].UPGRADE_ELEMENT){
														// if(datatempoModelUpgradeRecruitREC[a2].PRODUCT=="Recruiting"){
															tempODATAPreCheckFilter.push(tempODATAPreCheck[q]);
															break;	
														// }
													}
												}
											}
											
											
											
											
											
										}
									}  else if(me.getView().byId("ddlProd").getSelectedKey()=="SM"){
										for(var a2=0;a2<datatempoModelUpgradeRecruitSM.length;a2++){
											
				// 							
											
											
												if(tempODATAPreCheck[q].UPGRADE_ELEMENT.indexOf("_")==-1){
													
											
												if(tempODATAPreCheck[q].UPGRADE_ELEMENT==datatempoModelUpgradeRecruitSM[a2].UPGRADE_ELEMENT){
														// if(oModelUpgradeRecruitData[a2].PRODUCT=="Succession Management"){
															tempODATAPreCheckFilter.push(tempODATAPreCheck[q]);
															break;	
														// }
													}
												
											}else{
												var majorBlk = tempODATAPreCheck[q].UPGRADE_ELEMENT.split("_");
												var lastItem = majorBlk[majorBlk.length-1];
												if(lastItem.length==32){
													majorBlk.pop();
													var CompmajorBlk = majorBlk.join("_");
													if(CompmajorBlk==datatempoModelUpgradeRecruitSM[a2].UPGRADE_ELEMENT){
														// if(oModelUpgradeRecruitData[a2].PRODUCT=="Succession Management"){
															tempODATAPreCheckFilter.push(tempODATAPreCheck[q]);
															break;	
														// }
													}
												}else{
													majorBlk.pop();
													majorBlk.pop();
													var CompmajorBlk = majorBlk.join("_");
													if(CompmajorBlk==datatempoModelUpgradeRecruitSM[a2].UPGRADE_ELEMENT){
														// if(oModelUpgradeRecruitData[a2].PRODUCT=="Succession Management"){
															tempODATAPreCheckFilter.push(tempODATAPreCheck[q]);
															break;	
														// }
													}
												}
											}
											
											
											
											
										}
									}  else if(me.getView().byId("ddlProd").getSelectedKey()=="PG"){
										for(var a2=0;a2<datatempoModelUpgradeRecruitPG.length;a2++){
											
											
										
											
											
											if(tempODATAPreCheck[q].UPGRADE_ELEMENT.indexOf("_")==-1){
											
													if(tempODATAPreCheck[q].UPGRADE_ELEMENT==datatempoModelUpgradeRecruitPG[a2].UPGRADE_ELEMENT){
														// if(oModelUpgradeRecruitData[a2].PRODUCT=="Performance and Goals"){
															tempODATAPreCheckFilter.push(tempODATAPreCheck[q]);
															break;	
														// }
													}
												
											}else{
												var majorBlk = tempODATAPreCheck[q].UPGRADE_ELEMENT.split("_");
												var lastItem = majorBlk[majorBlk.length-1];
												if(lastItem.length==32){
													majorBlk.pop();
													var CompmajorBlk = majorBlk.join("_");
													if(CompmajorBlk==datatempoModelUpgradeRecruitPG[a2].UPGRADE_ELEMENT){
														// if(oModelUpgradeRecruitData[a2].PRODUCT=="Performance and Goals"){
															tempODATAPreCheckFilter.push(tempODATAPreCheck[q]);
															break;	
														// }
													}
												}else{
													majorBlk.pop();
													majorBlk.pop();
													var CompmajorBlk = majorBlk.join("_");
													if(CompmajorBlk==datatempoModelUpgradeRecruitPG[a2].UPGRADE_ELEMENT){
														// if(oModelUpgradeRecruitData[a2].PRODUCT=="Performance and Goals"){
															tempODATAPreCheckFilter.push(tempODATAPreCheck[q]);
															break;	
														// }
													}
												}
											}
											
											
											
											
										}
									}  else if(me.getView().byId("ddlProd").getSelectedKey()=="CO"){
										for(var a2=0;a2<datatempoModelUpgradeRecruitCO.length;a2++){
											
										
				
											if(tempODATAPreCheck[q].UPGRADE_ELEMENT.indexOf("_")==-1){
												
											if(tempODATAPreCheck[q].UPGRADE_ELEMENT==datatempoModelUpgradeRecruitCO[a2].UPGRADE_ELEMENT){
												// if(oModelUpgradeRecruitData[a2].PRODUCT=="Compensation"){
													tempODATAPreCheckFilter.push(tempODATAPreCheck[q]);
													break;
												
												// }
												}
											
											}else{
												var majorBlk = tempODATAPreCheck[q].UPGRADE_ELEMENT.split("_");
												var lastItem = majorBlk[majorBlk.length-1];
												if(lastItem.length==32){
													majorBlk.pop();
													var CompmajorBlk = majorBlk.join("_");
													if(CompmajorBlk==datatempoModelUpgradeRecruitCO[a2].UPGRADE_ELEMENT){
														// if(oModelUpgradeRecruitData[a2].PRODUCT=="Compensation"){
															tempODATAPreCheckFilter.push(tempODATAPreCheck[q]);
															break;	
														// }
													}
												}else{
													majorBlk.pop();
													majorBlk.pop();
													var CompmajorBlk = majorBlk.join("_");
													if(CompmajorBlk==datatempoModelUpgradeRecruitCO[a2].UPGRADE_ELEMENT){
														// if(oModelUpgradeRecruitData[a2].PRODUCT=="Compensation"){
															tempODATAPreCheckFilter.push(tempODATAPreCheck[q]);
															break;	
														// }
													}
												}
											}
											
											
											
											
										}
									}  else if(me.getView().byId("ddlProd").getSelectedKey()=="ON"){
										for(var a2=0;a2<datatempoModelUpgradeRecruitON.length;a2++){
											
										
											
				
											if(tempODATAPreCheck[q].UPGRADE_ELEMENT.indexOf("_")==-1){
												
												if(tempODATAPreCheck[q].UPGRADE_ELEMENT==datatempoModelUpgradeRecruitON[a2].UPGRADE_ELEMENT){
												// if(oModelUpgradeRecruitData[a2].PRODUCT=="Onboarding" || oModelUpgradeRecruitData[a2].PRODUCT=="Onboarding 2.0"){
													tempODATAPreCheckFilter.push(tempODATAPreCheck[q]);
													break;
												// }
											}
											
												
											}else{
												var majorBlk = tempODATAPreCheck[q].UPGRADE_ELEMENT.split("_");
												var lastItem = majorBlk[majorBlk.length-1];
												if(lastItem.length==32){
													majorBlk.pop();
													var CompmajorBlk = majorBlk.join("_");
													if(CompmajorBlk==datatempoModelUpgradeRecruitON[a2].UPGRADE_ELEMENT){
														// if(oModelUpgradeRecruitData[a2].PRODUCT=="Onboarding" || oModelUpgradeRecruitData[a2].PRODUCT=="Onboarding 2.0"){
															tempODATAPreCheckFilter.push(tempODATAPreCheck[q]);
															break;	
														// }
													}
												}else{
													majorBlk.pop();
													majorBlk.pop();
													var CompmajorBlk = majorBlk.join("_");
													if(CompmajorBlk==datatempoModelUpgradeRecruitON[a2].UPGRADE_ELEMENT){
														// if(oModelUpgradeRecruitData[a2].PRODUCT=="Onboarding" || oModelUpgradeRecruitData[a2].PRODUCT=="Onboarding 2.0"){
															tempODATAPreCheckFilter.push(tempODATAPreCheck[q]);
															break;	
														// }
													}
												}
											}
											
											
											
										}
									}  else if(me.getView().byId("ddlProd").getSelectedKey()=="EC"){
										for(var a2=0; a2<datatempoModelUpgradeRecruitEC.length; a2++){
											
										// var datatempoModelUpgradeRecruitON = sap.ui.getCore().getModel("oModelUpgradeRecruitON").getData();
				// var datatempoModelUpgradeRecruitREC = sap.ui.getCore().getModel("oModelUpgradeRecruitREC").getData();
				// var datatempoModelUpgradeRecruitSM = sap.ui.getCore().getModel("oModelUpgradeRecruitSM").getData();
				// var datatempoModelUpgradeRecruitPG = sap.ui.getCore().getModel("oModelUpgradeRecruitPG").getData();
				// var datatempoModelUpgradeRecruitCO = sap.ui.getCore().getModel("oModelUpgradeRecruitCO").getData();
				// var datatempoModelUpgradeRecruitEC = sap.ui.getCore().getModel("oModelUpgradeRecruitEC").getData();
											
											
											if(tempODATAPreCheck[q].UPGRADE_ELEMENT.indexOf("_")==-1){
												
											
													if(tempODATAPreCheck[q].UPGRADE_ELEMENT==datatempoModelUpgradeRecruitEC[a2].UPGRADE_ELEMENT){
														// if(oModelUpgradeRecruitData[a2].PRODUCT=="Employee Central"){
															tempODATAPreCheckFilter.push(tempODATAPreCheck[q]);
															break;	
														// }
													}
												
											 
												
											}else{
												var majorBlk = tempODATAPreCheck[q].UPGRADE_ELEMENT.split("_");
												var lastItem = majorBlk[majorBlk.length-1];
												if(lastItem.length==32){
													majorBlk.pop();
													var CompmajorBlk = majorBlk.join("_");
													if(CompmajorBlk==datatempoModelUpgradeRecruitEC[a2].UPGRADE_ELEMENT){
														// if(datatempoModelUpgradeRecruitEC[a2].PRODUCT=="Employee Central"){
															tempODATAPreCheckFilter.push(tempODATAPreCheck[q]);
															break;	
														// }
													}
												}else{
													majorBlk.pop();
													majorBlk.pop();
													var CompmajorBlk = majorBlk.join("_");
													if(CompmajorBlk==datatempoModelUpgradeRecruitEC[a2].UPGRADE_ELEMENT){
														// if(oModelUpgradeRecruitData[a2].PRODUCT=="Employee Central"){
															tempODATAPreCheckFilter.push(tempODATAPreCheck[q]);
															break;	
														// }
													}
												}
											}
										}
									}
								}
						}
						
						if (tempODATAPreCheckFilter.length > 0) {
						for (var w = 0; w < tempODATAPreCheckFilter.length; w++) {
							// if(tempODATAPreCheckFilter[w].COMPANY=="CRUZ ROJA ESPAÑOLA"){
							// 	tempODATAPreCheckFilter[w].COMPANY="CRUZ ROJA ESPAÑOLA DESARROLLO";
							// }
							// if(tempODATAPreCheckFilter[w].COMPANY=="Release"){
							// 	tempODATAPreCheckFilter[w].COMPANY="Stericycle Inc (de)";
							// }
							
							var majorBlk = tempODATAPreCheckFilter[w].UPGRADE_ELEMENT.split("_");
							var lastItem = majorBlk[majorBlk.length-1];
							if(lastItem.length!=32){
							if(tempODATAPreCheckFilter[w].COMPANY!="BPMCINSTANCE4" && tempODATAPreCheckFilter[w].COMPANY!="BPMCINSTANCE1"){
								if (tempODATAPreCheckFilter[w].COMPANYSCHEMA != null && tempODATAPreCheckFilter[w].COMPANYSCHEMA.toLowerCase().indexOf("sfsales")==-1) {
								// if (tempODATAPreCheckFilter[w].COMPANYSCHEMA.toLowerCase().indexOf("sfv4") > -1 || tempODATAPreCheckFilter[w].COMPANYSCHEMA.toLowerCase().indexOf("hanapm") > -1 || tempODATAPreCheckFilter[w].COMPANYSCHEMA.toLowerCase().indexOf(
								// 		"stg") > -1 || tempODATAPreCheckFilter[w].COMPANYSCHEMA.toLowerCase().indexOf("stockpm172200_ref2") > -1  || tempODATAPreCheckFilter[w].COMPANYSCHEMA.toLowerCase().indexOf("dc") > -1) {
									tempDateRef.push({
										comp: tempODATAPreCheckFilter[w].COMPANY + GetDDMMYY(new Date(tempODATAPreCheckFilter[w].TIME_STAMP.toUTCString())),
										cmpny: tempODATAPreCheckFilter[w].COMPANY,
										time: GetDDMMYY(new Date(tempODATAPreCheckFilter[w].TIME_STAMP.toUTCString())),
										timeComp: GetDDMM(new Date(tempODATAPreCheckFilter[w].TIME_STAMP.toUTCString())),
										pertimestamp: tempODATAPreCheckFilter[w].TIME_STAMP.toUTCString()
											// upgrade: oData.results[w].UPGRADE_ELEMENT
									});
								// }
							}
							}
							}
						}

						var tempDatetempDateRef = tempDateRef.reduce(function(item, e1) {
							var matchesRef = item.filter(function(e2) {
								if (e1.cmpny == e2.cmpny && e1.timeComp == e2.timeComp) {
									return e1.cmpny == e2.cmpny;
								}
							});
							if (matchesRef.length == 0) {
								item.push(e1);
							}
							return item;
						}, []);

						var uniqueArrayRef = me.removeDuplicates(tempDatetempDateRef, "cmpny");

						var outputRef = [];

						uniqueArrayRef.forEach(function(value) {
							var existing = outputRef.filter(function(v, i) {
								return v.timeComp == value.timeComp;
							});

							if (existing.length) {
								var existingIndex = outputRef.indexOf(existing[0]);
								outputRef[existingIndex].cmpny = outputRef[existingIndex].cmpny.concat(value.cmpny);
								outputRef[existingIndex].time = outputRef[existingIndex].time.concat(value.time);
							} else {
								if (typeof value.cmpny == 'string') {
									value.cmpny = [value.cmpny];
								}
								if (typeof value.time == 'string') {
									value.time = [value.time];
								}
								outputRef.push(value);
							}
						});

						outputRef.sort(function(a, b) {
							return (new Date(a.timeComp) > new Date(b.timeComp)) ? 1 : ((new Date(b.timeComp) > new Date(a.timeComp)) ? -1 : 0);
						});

						// for (var w = 0; w < outputRef.length; w++) {
						// 	if(w==0){
						// 		inputFeedArryRef.push({
						// 			time: outputRef[w].timeComp,
						// 			cmpny: outputRef[w].cmpny.length,
						// 			commu: outputRef[w].cmpny.length,
						// 		});
						// 	}else{
						// 		inputFeedArryRef.push({
						// 			time: outputRef[w].timeComp,
						// 			cmpny: outputRef[w].cmpny.length,
						// 			commu: inputFeedArryRef[w-1].commu+outputRef[w].cmpny.length,
						// 		});
						// 	}
						// }

						// oDataCHSTLineRef = {
						// 	data: inputFeedArryRef
						// };

						// var oModelLineChartSVAccDetailRef = sap.ui.getCore().getModel("oModelLineChartSVAccDetailRef");
						// oModelLineChartSVAccDetailRef.setData(oDataCHSTLineRef);

						// var timeInputRef = [];
						// var cmpnyInputRef = [];
						// var commuInputRef = [];

						// for(var t=0;t<inputFeedArryRef.length;t++){
						// 	 timeInputRef.push(inputFeedArryRef[t].time);
						// 	 cmpnyInputRef.push(inputFeedArryRef[t].cmpny);
						// 	 commuInputRef.push(inputFeedArryRef[t].commu);
						// }

						// var oModelLineChartSVAccDetail = sap.ui.getCore().getModel("oModelLineChartSVAccDetail");
						var oModelDetailOutput = sap.ui.getCore().getModel("oModelDetailOutput").getData();

						for (var x = 0; x < outputRef.length; x++) {
							for (var y = 0; y < oModelDetailOutput.length; y++) {
								if (outputRef[x].timeComp == oModelDetailOutput[y].timeComp) {
									
									if(oModelDetailOutput[y].cmpny.length>outputRef[x].cmpny.length){
										oModelDetailOutput[y].cmpny = outputRef[x].cmpny;
										
										
										
									// var obj = {}, matched = [],
								 //   unmatched = [];
								 //   for (var i = 0, l = oModelDetailOutput[y].cmpny.length; i < l; i++) {
								 //       obj[oModelDetailOutput[y].cmpny[i]] = (obj[oModelDetailOutput[y].cmpny[i]] || 0) + 1;
								 //   }
								 //   for (i = 0; i < outputRef[x].cmpny.length; i++) {
								 //       var val = outputRef[x].cmpny[i];
								 //       if (val in obj) {
								 //           matched.push(val);
								 //       } else {
								 //           unmatched.push(val);
								 //       }
								 //   }
								 //   console.log(obj);
								 //   console.log(matched);
								 //   console.log(unmatched);
    
										
										
				 						
									}

									// var array1 = oModelDetailOutput[y].cmpny; //17
									// var array2 = outputRef[x].cmpny; //15

									// var distAry = [];

									// if (array1.length > array2.length) {
									// 	array1 = array2;
										
									// 	// var index;
									// 	// for (var i=0; i<array1.length; i++) {
									// 	//     index = array2.indexOf(array1[i]);
									// 	//     if (index == -1) {
									// 	//         array1.splice(index, 1);
									// 	//     }
									// 	// }
									// } else {

									// }
								}
							}
						}
						
						var oModelAreaSplineRef = new sap.ui.model.json.JSONModel();
						sap.ui.getCore().setModel(oModelAreaSplineRef, "oModelAreaSplineRef");
						
						oModelAreaSplineRef.setData(oModelDetailOutput);
						

						for (var w = 0; w < oModelDetailOutput.length; w++) {
							if (w == 0) {
								inputFeedArryRef.push({
									time: oModelDetailOutput[w].timeComp,
									cmpny: oModelDetailOutput[w].cmpny.length,
									commu: oModelDetailOutput[w].cmpny.length,
								});
							} else {
								inputFeedArryRef.push({
									time: oModelDetailOutput[w].timeComp,
									cmpny: oModelDetailOutput[w].cmpny.length,
									commu: inputFeedArryRef[w - 1].commu + oModelDetailOutput[w].cmpny.length,
								});
							}
						}

						oDataCHSTLineRef = {
							data: inputFeedArryRef
						};

						var oModelLineChartSVAccDetailRef = sap.ui.getCore().getModel("oModelLineChartSVAccDetailRef");
						oModelLineChartSVAccDetailRef.setData(oDataCHSTLineRef);

						var timeInputRef = [];
						var cmpnyInputRef = [];
						var commuInputRef = [];

						for (var t = 0; t < inputFeedArryRef.length; t++) {
							timeInputRef.push(inputFeedArryRef[t].time);
							cmpnyInputRef.push(inputFeedArryRef[t].cmpny);
							commuInputRef.push(inputFeedArryRef[t].commu);
						}
						if(inputFeedArryRef.length==0){
							me.getView().byId("noCustValSubNUiqueAction").setValue(0);
							me.getView().byId("noCustValSubExistAction").setValue(0);
						}else{
							
							
							setTimeout(function() {	
								
								
							
														
														
														
							if(window.CountGlbl > inputFeedArryRef[inputFeedArryRef.length-1].commu){
								me.getView().byId("noCustValSubNUiqueAction").setValue(inputFeedArryRef[inputFeedArryRef.length-1].commu);
								me.getView().byId("noCustValSubExistAction").setValue((window.CountGlbl)-(inputFeedArryRef[inputFeedArryRef.length-1].commu));
							}else{
								var diff = (inputFeedArryRef[inputFeedArryRef.length-1].commu)-(window.CountGlbl);
								var val1 = inputFeedArryRef[inputFeedArryRef.length-1].commu- diff;
								
								me.getView().byId("noCustValSubNUiqueAction").setValue(val1);
								me.getView().byId("noCustValSubExistAction").setValue(window.CountGlbl-val1);
									
							}
							}, 500);
							
						}
						Highcharts.setOptions({
							colors: Highcharts.map(['#f0ab00', '#6586AD'], function(color) {
								return {
									linearGradient: {
										cx: 0.5,
										cy: 0.3,
										r: 0.7
									}
								};
							})
						});

						Highcharts.SVGRenderer.prototype.symbols.download = function(x, y, w, h) {
							var path = [
								// Arrow stem
								'M', x + w * 0.5, y,
								'L', x + w * 0.5, y + h * 0.7,
								// Arrow head
								'M', x + w * 0.3, y + h * 0.5,
								'L', x + w * 0.5, y + h * 0.7,
								'L', x + w * 0.7, y + h * 0.5,
								// Box
								'M', x, y + h * 0.9,
								'L', x, y + h,
								'L', x + w, y + h,
								'L', x + w, y + h * 0.9
							];
							return path;
						};

						var chartArea = Highcharts.chart('repoContainerReviewArea', {
							chart: {
								type: 'areaspline',
								// height: '330',
								// width: '510',
								plotBackgroundColor: "transparent",
								plotBorderWidth: null,
								plotShadow: false
							},
							// colors:["#e1b23f","#457aba"],
							title: {
								text: ''
							},
							legend: {
								itemStyle: {
									color: '#ddd',
								},
								itemDistance: 50
							},
							xAxis: {
								labels: {
									style: {
										color: '#ddd'
									}
								},
								categories: timeInputRef,
								tickColor: 'transparent'
							},
							yAxis: {
								title: {
									text: ''
								},
								labels: {
									style: {
										color: '#ddd'
									}
								},
								gridLineColor: 'transparent'
							},
							tooltip: {
								shared: true,
								valueSuffix: ' Customers'
							},
							credits: {
								enabled: false
							},
							plotOptions: {
								// areaspline: {
								//       fillOpacity: 0.5
								//   },
								series: {
									dataLabels: {
										align: 'center',
										enabled: true,
										color: '#ddd'
									},
									allowPointSelect: true,
									marker: {
						                states: {
						                    select: {
						                        fillColor: '#63e5e4',
						                    }
						                }
						            },
									point: {
				                        events: {
				                            click: function(e) {
				                            	if(this.graphic.symbolName=="circle"){
				                            		// new sap.m.MessageToast.show("Cummulative points are unselectable. Please select points from other series.");
				                            		return false;
				                            	}
			                            		if (this.selected == false || this.selected == undefined) {
					        //                     	var chart = $("#repoContainerReview").highcharts();
													// var selectedPoints = chart.getSelectedPoints();
													// if(selectedPoints.length>0){
													// 	selectedPoints[0].select();	
													// }
													
													var chartDay = $("#repoContainerReviewAreaDay").highcharts();
													var selectedPointsDay = chartDay.getSelectedPoints();
													if(selectedPointsDay.length>0){
														selectedPointsDay[0].select();	
													}
											        
					        //                     	me.getView().byId("HBarChart").vizSelection([], {
													// 	"clearSelection": true
													// });
													var aFilters = [];
													
					                            	var oModelAreaSplineRefData = sap.ui.getCore().getModel("oModelAreaSplineRef").getData();
					                            	for(var q=0;q<oModelAreaSplineRefData.length;q++){
					                            		if(oModelAreaSplineRefData[q].timeComp==this.category){
					                            			if(this.options.y==oModelAreaSplineRefData[q].cmpny.length){
				                            					for (var j = 0; j < oModelAreaSplineRefData[q].cmpny.length; j++) {
																	// var filter = new sap.ui.model.Filter("val", sap.ui.model.FilterOperator.Contains, oModelAreaSplineRefData[q].cmpny[j]);
																	var filter = new sap.ui.model.Filter("val", sap.ui.model.FilterOperator.EQ, oModelAreaSplineRefData[q].cmpny[j]);
																	aFilters.push(filter);
																}
	
																// update list binding
																var list = me.getView().byId("listTable");
																var binding = list.getBinding("items");
																binding.filter(aFilters, "Application");
																me.getView().byId("filterLabel").setText(this.category+" Customers");
																me.getView().byId("cancelBtn").setVisible(true);
					                            			}else{
					                            				var aFilters = [];
	
																// update list binding
																var list = me.getView().byId("listTable");
																var binding = list.getBinding("items");
																binding.filter(aFilters, "Application");
																me.getView().byId("filterLabel").setText("All Customers");
																me.getView().byId("cancelBtn").setVisible(false);
					                            			}
					                            		}
					                            	}
			                            		}else{
			                            			var aFilters = [];

													// update list binding
													var list = me.getView().byId("listTable");
													var binding = list.getBinding("items");
													binding.filter(aFilters, "Application");
													me.getView().byId("filterLabel").setText("All Customers");
													me.getView().byId("cancelBtn").setVisible(false);
			                            		}
						        			}
					                    }
			                        }
								},
							},
							series: [{
								name: 'Cumulative',
								data: commuInputRef
							}, {
								name: 'Count',
								data: cmpnyInputRef
							}],
							navigation: {
								buttonOptions: {
									verticalAlign: 'top',
									x: 10,
									y: -10
								},
								menuStyle: {
									background: '#555'
								},
								menuItemStyle: {
									color: '#ddd'
								}
							},
							exporting: {
								chartOptions: {
									chart: {
										backgroundColor: '#555'
									}
								},
								buttons: {
									contextButton: {
										symbol: 'download',
										symbolFill: '#555'
									}
								},
								filename: 'Adoption Chart'
							}

						});

					}
			}else{
				
			
			if (para != "") {
				var url =
					"/UpgradeCenterResult?$select=UPGRADE_ELEMENT,COMPANY,COMPANYSCHEMA,TIME_STAMP&$orderby=TIME_STAMP desc&$filter=(substringof('sfv4',COMPANYSCHEMA) or substringof('SFV4',COMPANYSCHEMA) or substringof('STOCKPM',COMPANYSCHEMA) or substringof('GLOBUSER_DVLHCM20S',COMPANYSCHEMA) or substringof('globuser_dvlhcm20s',COMPANYSCHEMA) or substringof('stockpm',COMPANYSCHEMA) or substringof('GLOBUSER_DVLHCM20S',COMPANYSCHEMA) or substringof('globuser_dvlhcm20s',COMPANYSCHEMA) or substringof('STOCKPM000110_REF2',COMPANYSCHEMA) or substringof('stockpm000110_ref2',COMPANYSCHEMA) or substringof('STOCKPM172200_REF2',COMPANYSCHEMA) or substringof('stockpm172200_ref2',COMPANYSCHEMA) or substringof('STOCKPM170737_REF',COMPANYSCHEMA) or substringof('stockpm170737_ref',COMPANYSCHEMA)    or substringof('DC',COMPANYSCHEMA) or substringof('dc',COMPANYSCHEMA) or substringof('STG',COMPANYSCHEMA) or substringof('stg',COMPANYSCHEMA) or substringof('HANAPM',COMPANYSCHEMA) or substringof('hanapm',COMPANYSCHEMA)) and COMPANYID ne 'PAYNGPPRL' and COMPANYID ne 'USBASEIAS22V1' and COMPANYID ne 'SAPSDCHXM0001' and COMPANYID ne 'PAYNGPPRLE' and COMPANYSCHEMA ne '' and COMPANY ne '' and COMPANY ne 'SAP SF Cloud Engineering' and FILEVERSION eq '" +
					para + "' and TIME_STAMP ge datetime'" + fromCompDateAll + "' and TIME_STAMP le datetime'" + toCompDateAll + "'";
			} else {
				var url =
					"/UpgradeCenterResult?$select=UPGRADE_ELEMENT,COMPANY,COMPANYSCHEMA,TIME_STAMP&$orderby=TIME_STAMP desc&$filter=(substringof('sfv4',COMPANYSCHEMA) or substringof('SFV4',COMPANYSCHEMA) or substringof('STOCKPM',COMPANYSCHEMA) or substringof('GLOBUSER_DVLHCM20S',COMPANYSCHEMA) or substringof('globuser_dvlhcm20s',COMPANYSCHEMA) or substringof('stockpm',COMPANYSCHEMA) or substringof('GLOBUSER_DVLHCM20S',COMPANYSCHEMA) or substringof('globuser_dvlhcm20s',COMPANYSCHEMA) or substringof('STOCKPM000110_REF2',COMPANYSCHEMA) or substringof('stockpm000110_ref2',COMPANYSCHEMA) or substringof('STOCKPM172200_REF2',COMPANYSCHEMA) or substringof('stockpm172200_ref2',COMPANYSCHEMA) or substringof('STOCKPM170737_REF',COMPANYSCHEMA) or substringof('stockpm170737_ref',COMPANYSCHEMA)    or substringof('DC',COMPANYSCHEMA) or substringof('dc',COMPANYSCHEMA) or substringof('STG',COMPANYSCHEMA) or substringof('stg',COMPANYSCHEMA) or substringof('HANAPM',COMPANYSCHEMA) or substringof('hanapm',COMPANYSCHEMA)) and COMPANYID ne 'PAYNGPPRL' and COMPANYID ne 'USBASEIAS22V1' and COMPANYID ne 'SAPSDCHXM0001' and COMPANYID ne 'PAYNGPPRLE' and COMPANYSCHEMA ne '' and COMPANY ne '' and COMPANY ne 'SAP SF Cloud Engineering' and TIME_STAMP ge datetime'" +
					fromCompDateAll + "' and TIME_STAMP le datetime'" + toCompDateAll + "'";
			}

			mdl.read(
				url,
				null, null, true,
				function(oData, oResponse) {
					if(oData.results.length>0){
						
						var datatemp = oData.results;
					
						sap.ui.getCore().getModel("oModelUpgradeRefData").setData(datatemp);
						
						
						tempODATAPreCheck = oData.results;
						tempODATAPreCheckFilter = tempODATAPreCheck;
						// for (var q = 0; q < tempODATAPreCheck.length; q++) {
						// 	if(me.getView().byId("ddlProd").getSelectedKey()=="All"){
						// 		tempODATAPreCheckFilter.push(tempODATAPreCheck[q]);
						// 	} else if(me.getView().byId("ddlProd").getSelectedKey()=="RM"){
						// 		for(var a2=0;a2<oModelUpgradeRecruitData.length;a2++){
						// 			if(tempODATAPreCheck[q].UPGRADE_ELEMENT==oModelUpgradeRecruitData[a2].UPGRADE_ELEMENT){
						// 				tempODATAPreCheckFilter.push(tempODATAPreCheck[q]);
						// 			}
						// 				break;
						// 		}
						// 	} else if(me.getView().byId("ddlProd").getSelectedKey()=="EC"){
						// 		for(var a2=0; a2<oModelUpgradeRecruitData.length; a2++){
						// 			if(tempODATAPreCheck[q].UPGRADE_ELEMENT!=oModelUpgradeRecruitData[a2].UPGRADE_ELEMENT){
						// 				tempODATAPreCheckFilter.push(tempODATAPreCheck[q]);
						// 			}
						// 				break;
						// 		}
						// 	}
						// }
						if (tempODATAPreCheckFilter.length > 0) {
						for (var w = 0; w < tempODATAPreCheckFilter.length; w++) {
							// if(tempODATAPreCheckFilter[w].COMPANY=="CRUZ ROJA ESPAÑOLA"){
							// 	tempODATAPreCheckFilter[w].COMPANY="CRUZ ROJA ESPAÑOLA DESARROLLO";
							// }
							// if(tempODATAPreCheckFilter[w].COMPANY=="Release"){
							// 	tempODATAPreCheckFilter[w].COMPANY="Stericycle Inc (de)";
							// }
							
							var majorBlk = tempODATAPreCheckFilter[w].UPGRADE_ELEMENT.split("_");
							var lastItem = majorBlk[majorBlk.length-1];
							if(lastItem.length!=32){
							if(tempODATAPreCheckFilter[w].COMPANY!="BPMCINSTANCE4" && tempODATAPreCheckFilter[w].COMPANY!="BPMCINSTANCE1"){
								if (tempODATAPreCheckFilter[w].COMPANYSCHEMA != null && tempODATAPreCheckFilter[w].COMPANYSCHEMA.toLowerCase().indexOf("sfsales")==-1) {
								// if (tempODATAPreCheckFilter[w].COMPANYSCHEMA.toLowerCase().indexOf("sfv4") > -1 || tempODATAPreCheckFilter[w].COMPANYSCHEMA.toLowerCase().indexOf("hanapm") > -1 || tempODATAPreCheckFilter[w].COMPANYSCHEMA.toLowerCase().indexOf(
								// 		"stg") > -1 || tempODATAPreCheckFilter[w].COMPANYSCHEMA.toLowerCase().indexOf("stockpm172200_ref2") > -1  || tempODATAPreCheckFilter[w].COMPANYSCHEMA.toLowerCase().indexOf("dc") > -1) {
									tempDateRef.push({
										comp: tempODATAPreCheckFilter[w].COMPANY + GetDDMMYY(new Date(tempODATAPreCheckFilter[w].TIME_STAMP.toUTCString())),
										cmpny: tempODATAPreCheckFilter[w].COMPANY,
										time: GetDDMMYY(new Date(tempODATAPreCheckFilter[w].TIME_STAMP.toUTCString())),
										timeComp: GetDDMM(new Date(tempODATAPreCheckFilter[w].TIME_STAMP.toUTCString())),
										pertimestamp: tempODATAPreCheckFilter[w].TIME_STAMP.toUTCString()
											// upgrade: oData.results[w].UPGRADE_ELEMENT
									});
								// }
							}
							}
							}
						}

						var tempDatetempDateRef = tempDateRef.reduce(function(item, e1) {
							var matchesRef = item.filter(function(e2) {
								if (e1.cmpny == e2.cmpny && e1.timeComp == e2.timeComp) {
									return e1.cmpny == e2.cmpny;
								}
							});
							if (matchesRef.length == 0) {
								item.push(e1);
							}
							return item;
						}, []);

						var uniqueArrayRef = me.removeDuplicates(tempDatetempDateRef, "cmpny");

						var outputRef = [];

						uniqueArrayRef.forEach(function(value) {
							var existing = outputRef.filter(function(v, i) {
								return v.timeComp == value.timeComp;
							});

							if (existing.length) {
								var existingIndex = outputRef.indexOf(existing[0]);
								outputRef[existingIndex].cmpny = outputRef[existingIndex].cmpny.concat(value.cmpny);
								outputRef[existingIndex].time = outputRef[existingIndex].time.concat(value.time);
							} else {
								if (typeof value.cmpny == 'string') {
									value.cmpny = [value.cmpny];
								}
								if (typeof value.time == 'string') {
									value.time = [value.time];
								}
								outputRef.push(value);
							}
						});

						outputRef.sort(function(a, b) {
							return (new Date(a.timeComp) > new Date(b.timeComp)) ? 1 : ((new Date(b.timeComp) > new Date(a.timeComp)) ? -1 : 0);
						});

						// for (var w = 0; w < outputRef.length; w++) {
						// 	if(w==0){
						// 		inputFeedArryRef.push({
						// 			time: outputRef[w].timeComp,
						// 			cmpny: outputRef[w].cmpny.length,
						// 			commu: outputRef[w].cmpny.length,
						// 		});
						// 	}else{
						// 		inputFeedArryRef.push({
						// 			time: outputRef[w].timeComp,
						// 			cmpny: outputRef[w].cmpny.length,
						// 			commu: inputFeedArryRef[w-1].commu+outputRef[w].cmpny.length,
						// 		});
						// 	}
						// }

						// oDataCHSTLineRef = {
						// 	data: inputFeedArryRef
						// };

						// var oModelLineChartSVAccDetailRef = sap.ui.getCore().getModel("oModelLineChartSVAccDetailRef");
						// oModelLineChartSVAccDetailRef.setData(oDataCHSTLineRef);

						// var timeInputRef = [];
						// var cmpnyInputRef = [];
						// var commuInputRef = [];

						// for(var t=0;t<inputFeedArryRef.length;t++){
						// 	 timeInputRef.push(inputFeedArryRef[t].time);
						// 	 cmpnyInputRef.push(inputFeedArryRef[t].cmpny);
						// 	 commuInputRef.push(inputFeedArryRef[t].commu);
						// }

						// var oModelLineChartSVAccDetail = sap.ui.getCore().getModel("oModelLineChartSVAccDetail");
						var oModelDetailOutput = sap.ui.getCore().getModel("oModelDetailOutput").getData();

						for (var x = 0; x < outputRef.length; x++) {
							for (var y = 0; y < oModelDetailOutput.length; y++) {
								if (outputRef[x].timeComp == oModelDetailOutput[y].timeComp) {
									
									if(oModelDetailOutput[y].cmpny.length>outputRef[x].cmpny.length){
										oModelDetailOutput[y].cmpny = outputRef[x].cmpny;
										
										
										
									// var obj = {}, matched = [],
								 //   unmatched = [];
								 //   for (var i = 0, l = oModelDetailOutput[y].cmpny.length; i < l; i++) {
								 //       obj[oModelDetailOutput[y].cmpny[i]] = (obj[oModelDetailOutput[y].cmpny[i]] || 0) + 1;
								 //   }
								 //   for (i = 0; i < outputRef[x].cmpny.length; i++) {
								 //       var val = outputRef[x].cmpny[i];
								 //       if (val in obj) {
								 //           matched.push(val);
								 //       } else {
								 //           unmatched.push(val);
								 //       }
								 //   }
								 //   console.log(obj);
								 //   console.log(matched);
								 //   console.log(unmatched);
    
										
										
										
									}

									// var array1 = oModelDetailOutput[y].cmpny; //17
									// var array2 = outputRef[x].cmpny; //15

									// var distAry = [];

									// if (array1.length > array2.length) {
									// 	array1 = array2;
										
									// 	// var index;
									// 	// for (var i=0; i<array1.length; i++) {
									// 	//     index = array2.indexOf(array1[i]);
									// 	//     if (index == -1) {
									// 	//         array1.splice(index, 1);
									// 	//     }
									// 	// }
									// } else {

									// }
								}
							}
						}
						
						var oModelAreaSplineRef = new sap.ui.model.json.JSONModel();
						sap.ui.getCore().setModel(oModelAreaSplineRef, "oModelAreaSplineRef");
						
						oModelAreaSplineRef.setData(oModelDetailOutput);
						

						for (var w = 0; w < oModelDetailOutput.length; w++) {
							if (w == 0) {
								inputFeedArryRef.push({
									time: oModelDetailOutput[w].timeComp,
									cmpny: oModelDetailOutput[w].cmpny.length,
									commu: oModelDetailOutput[w].cmpny.length,
								});
							} else {
								inputFeedArryRef.push({
									time: oModelDetailOutput[w].timeComp,
									cmpny: oModelDetailOutput[w].cmpny.length,
									commu: inputFeedArryRef[w - 1].commu + oModelDetailOutput[w].cmpny.length,
								});
							}
						}

						oDataCHSTLineRef = {
							data: inputFeedArryRef
						};

						var oModelLineChartSVAccDetailRef = sap.ui.getCore().getModel("oModelLineChartSVAccDetailRef");
						oModelLineChartSVAccDetailRef.setData(oDataCHSTLineRef);

						var timeInputRef = [];
						var cmpnyInputRef = [];
						var commuInputRef = [];

						for (var t = 0; t < inputFeedArryRef.length; t++) {
							timeInputRef.push(inputFeedArryRef[t].time);
							cmpnyInputRef.push(inputFeedArryRef[t].cmpny);
							commuInputRef.push(inputFeedArryRef[t].commu);
						}
						if(inputFeedArryRef.length==0){
							me.getView().byId("noCustValSubNUiqueAction").setValue(0);
							me.getView().byId("noCustValSubExistAction").setValue(0);
						}else{
							
							setTimeout(function() {	
							if(window.CountGlbl > inputFeedArryRef[inputFeedArryRef.length-1].commu){
								me.getView().byId("noCustValSubNUiqueAction").setValue(inputFeedArryRef[inputFeedArryRef.length-1].commu);
								me.getView().byId("noCustValSubExistAction").setValue((window.CountGlbl)-(inputFeedArryRef[inputFeedArryRef.length-1].commu));
							}else{
								var diff = (inputFeedArryRef[inputFeedArryRef.length-1].commu)-(window.CountGlbl);
								var val1 = inputFeedArryRef[inputFeedArryRef.length-1].commu- diff;
								
								me.getView().byId("noCustValSubNUiqueAction").setValue(val1);
								me.getView().byId("noCustValSubExistAction").setValue(window.CountGlbl-val1);
									
							}
							}, 500);
							
						}
						// Highcharts.setOptions({
						// 	colors: Highcharts.map(['#f0ab00', '#6586AD'], function(color) {
						// 		return {
						// 			linearGradient: {
						// 				cx: 0.5,
						// 				cy: 0.3,
						// 				r: 0.7
						// 			}
						// 		};
						// 	})
						// });

						Highcharts.SVGRenderer.prototype.symbols.download = function(x, y, w, h) {
							var path = [
								// Arrow stem
								'M', x + w * 0.5, y,
								'L', x + w * 0.5, y + h * 0.7,
								// Arrow head
								'M', x + w * 0.3, y + h * 0.5,
								'L', x + w * 0.5, y + h * 0.7,
								'L', x + w * 0.7, y + h * 0.5,
								// Box
								'M', x, y + h * 0.9,
								'L', x, y + h,
								'L', x + w, y + h,
								'L', x + w, y + h * 0.9
							];
							return path;
						};

						var chartArea = Highcharts.chart('repoContainerReviewArea', {
							chart: {
								type: 'areaspline',
								// height: '330',
								// width: '510',
								plotBackgroundColor: "transparent",
								plotBorderWidth: null,
								plotShadow: false
							},
							// colors:["#e1b23f","#457aba"],
							title: {
								text: ''
							},
							legend: {
								itemStyle: {
									color: '#ddd',
								},
								itemDistance: 50
							},
							xAxis: {
								labels: {
									style: {
										color: '#ddd'
									}
								},
								categories: timeInputRef,
								tickColor: 'transparent'
							},
							yAxis: {
								title: {
									text: ''
								},
								labels: {
									style: {
										color: '#ddd'
									}
								},
								gridLineColor: 'transparent'
							},
							tooltip: {
								shared: true,
								valueSuffix: ' Customers'
							},
							credits: {
								enabled: false
							},
							plotOptions: {
								// areaspline: {
								//       fillOpacity: 0.5
								//   },
								series: {
									// fillColor: {
									// 	linearGradient: [0, 0, 0, 300]
									// },
									dataLabels: {
										align: 'center',
										enabled: true,
										color: '#ddd'
									},
									allowPointSelect: true,
									marker: {
						                states: {
						                    select: {
						                        fillColor: '#63e5e4',
						                    }
						                }
						            },
									point: {
				                        events: {
				                            click: function(e) {
				                            	if(this.graphic.symbolName=="circle"){
				                            		// new sap.m.MessageToast.show("Cummulative points are unselectable. Please select points from other series.");
				                            		return false;
				                            	}
			                            		if (this.selected == false || this.selected == undefined) {
					        //                     	var chart = $("#repoContainerReview").highcharts();
													// var selectedPoints = chart.getSelectedPoints();
													// if(selectedPoints.length>0){
													// 	selectedPoints[0].select();	
													// }
													
													var chartDay = $("#repoContainerReviewAreaDay").highcharts();
													var selectedPointsDay = chartDay.getSelectedPoints();
													if(selectedPointsDay.length>0){
														selectedPointsDay[0].select();	
													}
											        
					        //                     	me.getView().byId("HBarChart").vizSelection([], {
													// 	"clearSelection": true
													// });
													var aFilters = [];
													
					                            	var oModelAreaSplineRefData = sap.ui.getCore().getModel("oModelAreaSplineRef").getData();
					                            	for(var q=0;q<oModelAreaSplineRefData.length;q++){
					                            		if(oModelAreaSplineRefData[q].timeComp==this.category){
					                            			if(this.options.y==oModelAreaSplineRefData[q].cmpny.length){
				                            					for (var j = 0; j < oModelAreaSplineRefData[q].cmpny.length; j++) {
																	// var filter = new sap.ui.model.Filter("val", sap.ui.model.FilterOperator.Contains, oModelAreaSplineRefData[q].cmpny[j]);
																	var filter = new sap.ui.model.Filter("val", sap.ui.model.FilterOperator.EQ, oModelAreaSplineRefData[q].cmpny[j]);
																	aFilters.push(filter);
																}
	
																// update list binding
																var list = me.getView().byId("listTable");
																var binding = list.getBinding("items");
																binding.filter(aFilters, "Application");
																me.getView().byId("filterLabel").setText(this.category+" Customers");
																me.getView().byId("cancelBtn").setVisible(true);
					                            			}else{
					                            				var aFilters = [];
	
																// update list binding
																var list = me.getView().byId("listTable");
																var binding = list.getBinding("items");
																binding.filter(aFilters, "Application");
																me.getView().byId("filterLabel").setText("All Customers");
																me.getView().byId("cancelBtn").setVisible(false);
					                            			}
					                            		}
					                            	}
			                            		}else{
			                            			var aFilters = [];

													// update list binding
													var list = me.getView().byId("listTable");
													var binding = list.getBinding("items");
													binding.filter(aFilters, "Application");
													me.getView().byId("filterLabel").setText("All Customers");
													me.getView().byId("cancelBtn").setVisible(false);
			                            		}
						        			}
					                    }
			                        }
								},
							},
							series: [{
								name: 'Cumulative',
								data: commuInputRef
							}, {
								name: 'Count',
								data: cmpnyInputRef
							}],
							navigation: {
								buttonOptions: {
									verticalAlign: 'top',
									x: 10,
									y: -10
								},
								menuStyle: {
									background: '#555'
								},
								menuItemStyle: {
									color: '#ddd'
								}
							},
							exporting: {
								chartOptions: {
									chart: {
										backgroundColor: '#555'
									}
								},
								buttons: {
									contextButton: {
										symbol: 'download',
										symbolFill: '#555'
									}
								},
								filename: 'Adoption Chart'
							}

						});

					}
					}else{
						var oModelAreaSplineRef = new sap.ui.model.json.JSONModel();
						sap.ui.getCore().setModel(oModelAreaSplineRef, "oModelAreaSplineRef");
						oModelAreaSplineRef.setData([]);
						
						me.getView().byId("noCustValSubNUiqueAction").setValue(0);
						me.getView().byId("noCustValSubExistAction").setValue(0);
						
						$("#repoContainerReviewArea").find("svg").remove();
					}
				},
				function(oError) {
					console.log("Error 127");
				});
			
				
			}

		},
		callMainRef: function(mdl, para){
			var Datetoday = new Date();
			var fromDate = new Date();
			fromDate.setMonth((fromDate.getMonth() - 24));
			fromDate.setDate(fromDate.getDate() + 1);
			
			// if(fromDate.getDate()!=1){
			// 	fromDate.setDate(1);
			// }

			var fromCompDateAll = fromDate.toISOString();
			var toCompDateTemp = Datetoday.toISOString();

			fromCompDateAll = fromCompDateAll.split("T")[0] + "T00:00";
			toCompDateTemp = toCompDateTemp.split("T")[0] + "T24:00";
			var tempDateTo = (new Date(toCompDateTemp)).getDate();
			var d = new Date(toCompDateTemp);
			d.setDate(tempDateTo);
			var toCompDateAll = d.toISOString();
			toCompDateAll = toCompDateAll.split("T")[0] + "T24:00";
			
			if (para != "") {
					var url =
						"/UpgradeCenterResult?$select=UPGRADE_ELEMENT,RESULT,COMPANYSCHEMA,COMPANY,TIME_STAMP&$orderby=TIME_STAMP desc&$filter=(substringof('sfv4',COMPANYSCHEMA) or substringof('SFV4',COMPANYSCHEMA) or substringof('STOCKPM',COMPANYSCHEMA) or substringof('GLOBUSER_DVLHCM20S',COMPANYSCHEMA) or substringof('globuser_dvlhcm20s',COMPANYSCHEMA) or substringof('stockpm',COMPANYSCHEMA) or substringof('GLOBUSER_DVLHCM20S',COMPANYSCHEMA) or substringof('globuser_dvlhcm20s',COMPANYSCHEMA) or substringof('STOCKPM000110_REF2',COMPANYSCHEMA) or substringof('stockpm000110_ref2',COMPANYSCHEMA) or substringof('STOCKPM172200_REF2',COMPANYSCHEMA) or substringof('stockpm172200_ref2',COMPANYSCHEMA) or substringof('STOCKPM170737_REF',COMPANYSCHEMA) or substringof('stockpm170737_ref',COMPANYSCHEMA)    or substringof('DC',COMPANYSCHEMA) or substringof('dc',COMPANYSCHEMA) or substringof('STG',COMPANYSCHEMA) or substringof('stg',COMPANYSCHEMA) or substringof('HANAPM',COMPANYSCHEMA) or substringof('hanapm',COMPANYSCHEMA)) and COMPANYID ne 'PAYNGPPRL' and COMPANYID ne 'USBASEIAS22V1' and COMPANYID ne 'SAPSDCHXM0001' and COMPANYID ne 'PAYNGPPRLE' and COMPANYSCHEMA ne '' and COMPANY ne '' and COMPANY ne 'SAP SF Cloud Engineering' and FILEVERSION eq '" +
						para + "' and TIME_STAMP ge datetime'" + fromCompDateAll + "' and TIME_STAMP le datetime'" + toCompDateAll + "'";
				} else {
					var url =
						"/UpgradeCenterResult?$select=UPGRADE_ELEMENT,RESULT,COMPANYSCHEMA,COMPANY,TIME_STAMP&$orderby=TIME_STAMP desc&$filter=(substringof('sfv4',COMPANYSCHEMA) or substringof('SFV4',COMPANYSCHEMA) or substringof('STOCKPM',COMPANYSCHEMA) or substringof('GLOBUSER_DVLHCM20S',COMPANYSCHEMA) or substringof('globuser_dvlhcm20s',COMPANYSCHEMA) or substringof('stockpm',COMPANYSCHEMA) or substringof('GLOBUSER_DVLHCM20S',COMPANYSCHEMA) or substringof('globuser_dvlhcm20s',COMPANYSCHEMA) or substringof('STOCKPM000110_REF2',COMPANYSCHEMA) or substringof('stockpm000110_ref2',COMPANYSCHEMA) or substringof('STOCKPM172200_REF2',COMPANYSCHEMA) or substringof('stockpm172200_ref2',COMPANYSCHEMA) or substringof('STOCKPM170737_REF',COMPANYSCHEMA) or substringof('stockpm170737_ref',COMPANYSCHEMA)    or substringof('DC',COMPANYSCHEMA) or substringof('dc',COMPANYSCHEMA) or substringof('STG',COMPANYSCHEMA) or substringof('stg',COMPANYSCHEMA) or substringof('HANAPM',COMPANYSCHEMA) or substringof('hanapm',COMPANYSCHEMA)) and COMPANYID ne 'PAYNGPPRL' and COMPANYID ne 'USBASEIAS22V1' and COMPANYID ne 'SAPSDCHXM0001' and COMPANYID ne 'PAYNGPPRLE' and COMPANYSCHEMA ne '' and COMPANY ne '' and COMPANY ne 'SAP SF Cloud Engineering' and TIME_STAMP ge datetime'" +
						fromCompDateAll + "' and TIME_STAMP le datetime'" + toCompDateAll + "'";
				}
				
				mdl.read(
					url,
					null, null, true,
					function(oData, oResponse) {
						if(oData.results.length>0){
							var datatemp = oData.results;
						
							localStorage.setItem("setMainRefData", JSON.stringify(datatemp));
							
						}else{
							
						}
					},
					function(oError) {
						console.log("Error 127");
					});
		},

		loadKPINumbers: function(mdl, para, fromCompDate, toCompDate) {
			var me = this;
			
			var tempODATAPreCheck = [];
			var tempODATAPreCheckFilter = [];
			// var oModelUpgradeRecruitData = sap.ui.getCore().getModel("oModelUpgradeRecruit").getData();
			
			var datatempoModelUpgradeRecruitON = sap.ui.getCore().getModel("oModelUpgradeRecruitON").getData();
			var datatempoModelUpgradeRecruitREC = sap.ui.getCore().getModel("oModelUpgradeRecruitREC").getData();
			var datatempoModelUpgradeRecruitSM = sap.ui.getCore().getModel("oModelUpgradeRecruitSM").getData();
			var datatempoModelUpgradeRecruitPG = sap.ui.getCore().getModel("oModelUpgradeRecruitPG").getData();
			var datatempoModelUpgradeRecruitCO = sap.ui.getCore().getModel("oModelUpgradeRecruitCO").getData();
			var datatempoModelUpgradeRecruitEC = sap.ui.getCore().getModel("oModelUpgradeRecruitEC").getData();
			
			
			var deployKey = me.getView().byId("ddlDeploy").getSelectedKey();
			
			if (para != "") { 
				if(deployKey=="All"){
				var url =
					"/UpgradeCenterResult?$select=RESULT,UPGRADE_ELEMENT,COMPANYSCHEMA,COMPANY,MIGRATION&$orderby=TIME_STAMP desc&$filter=(substringof('sfv4',COMPANYSCHEMA) or substringof('SFV4',COMPANYSCHEMA) or substringof('STOCKPM',COMPANYSCHEMA) or substringof('GLOBUSER_DVLHCM20S',COMPANYSCHEMA) or substringof('globuser_dvlhcm20s',COMPANYSCHEMA) or substringof('stockpm',COMPANYSCHEMA) or substringof('GLOBUSER_DVLHCM20S',COMPANYSCHEMA) or substringof('globuser_dvlhcm20s',COMPANYSCHEMA) or substringof('STOCKPM000110_REF2',COMPANYSCHEMA) or substringof('stockpm000110_ref2',COMPANYSCHEMA) or substringof('STOCKPM172200_REF2',COMPANYSCHEMA) or substringof('stockpm172200_ref2',COMPANYSCHEMA) or substringof('STOCKPM170737_REF',COMPANYSCHEMA) or substringof('stockpm170737_ref',COMPANYSCHEMA)    or substringof('DC',COMPANYSCHEMA) or substringof('dc',COMPANYSCHEMA) or substringof('STG',COMPANYSCHEMA) or substringof('stg',COMPANYSCHEMA) or substringof('HANAPM',COMPANYSCHEMA) or substringof('hanapm',COMPANYSCHEMA)) and COMPANYID ne 'PAYNGPPRL' and COMPANYID ne 'USBASEIAS22V1' and COMPANYID ne 'SAPSDCHXM0001' and COMPANYID ne 'PAYNGPPRLE' and COMPANYSCHEMA ne '' and COMPANY ne '' and COMPANY ne 'SAP SF Cloud Engineering' and FILEVERSION eq '" +
					para + "' and TIME_STAMP ge datetime'" + fromCompDate + "' and TIME_STAMP le datetime'" + toCompDate + "'";
				}else if(deployKey=="CUST"){
					var url =
					"/UpgradeCenterResult?$select=RESULT,UPGRADE_ELEMENT,COMPANYSCHEMA,COMPANY,MIGRATION&$orderby=TIME_STAMP desc&$filter=(substringof('sfv4',COMPANYSCHEMA) or substringof('SFV4',COMPANYSCHEMA) or substringof('STOCKPM',COMPANYSCHEMA) or substringof('GLOBUSER_DVLHCM20S',COMPANYSCHEMA) or substringof('globuser_dvlhcm20s',COMPANYSCHEMA) or substringof('stockpm',COMPANYSCHEMA) or substringof('GLOBUSER_DVLHCM20S',COMPANYSCHEMA) or substringof('globuser_dvlhcm20s',COMPANYSCHEMA) or substringof('STOCKPM000110_REF2',COMPANYSCHEMA) or substringof('stockpm000110_ref2',COMPANYSCHEMA) or substringof('STOCKPM172200_REF2',COMPANYSCHEMA) or substringof('stockpm172200_ref2',COMPANYSCHEMA) or substringof('STOCKPM170737_REF',COMPANYSCHEMA) or substringof('stockpm170737_ref',COMPANYSCHEMA)    or substringof('DC',COMPANYSCHEMA) or substringof('dc',COMPANYSCHEMA) or substringof('STG',COMPANYSCHEMA) or substringof('stg',COMPANYSCHEMA) or substringof('HANAPM',COMPANYSCHEMA) or substringof('hanapm',COMPANYSCHEMA)) and substringof('_',UPGRADE_ELEMENT) and COMPANYID ne 'PAYNGPPRL' and COMPANYID ne 'USBASEIAS22V1' and COMPANYID ne 'SAPSDCHXM0001' and COMPANYID ne 'PAYNGPPRLE' and COMPANYSCHEMA ne '' and COMPANY ne '' and COMPANY ne 'SAP SF Cloud Engineering' and FILEVERSION eq '" +
					para + "' and TIME_STAMP ge datetime'" + fromCompDate + "' and TIME_STAMP le datetime'" + toCompDate + "'";
				}else{
				var url =
					"/UpgradeCenterResult?$select=RESULT,UPGRADE_ELEMENT,COMPANYSCHEMA,COMPANY,MIGRATION&$orderby=TIME_STAMP desc&$filter=(substringof('sfv4',COMPANYSCHEMA) or substringof('SFV4',COMPANYSCHEMA) or substringof('STOCKPM',COMPANYSCHEMA) or substringof('GLOBUSER_DVLHCM20S',COMPANYSCHEMA) or substringof('globuser_dvlhcm20s',COMPANYSCHEMA) or substringof('stockpm',COMPANYSCHEMA) or substringof('GLOBUSER_DVLHCM20S',COMPANYSCHEMA) or substringof('globuser_dvlhcm20s',COMPANYSCHEMA) or substringof('STOCKPM000110_REF2',COMPANYSCHEMA) or substringof('stockpm000110_ref2',COMPANYSCHEMA) or substringof('STOCKPM172200_REF2',COMPANYSCHEMA) or substringof('stockpm172200_ref2',COMPANYSCHEMA) or substringof('STOCKPM170737_REF',COMPANYSCHEMA) or substringof('stockpm170737_ref',COMPANYSCHEMA)    or substringof('DC',COMPANYSCHEMA) or substringof('dc',COMPANYSCHEMA) or substringof('STG',COMPANYSCHEMA) or substringof('stg',COMPANYSCHEMA) or substringof('HANAPM',COMPANYSCHEMA) or substringof('hanapm',COMPANYSCHEMA)) and indexof(UPGRADE_ELEMENT,'_') eq -1  and COMPANYID ne 'PAYNGPPRL' and COMPANYID ne 'USBASEIAS22V1' and COMPANYID ne 'SAPSDCHXM0001' and COMPANYID ne 'PAYNGPPRLE' and COMPANYSCHEMA ne '' and COMPANY ne '' and COMPANY ne 'SAP SF Cloud Engineering' and FILEVERSION eq '" +
					para + "' and TIME_STAMP ge datetime'" + fromCompDate + "' and TIME_STAMP le datetime'" + toCompDate + "'";	
				}
				// var url =
				// 	"/UpgradeCenterResult?$select=UPGRADE_ELEMENT,COMPANYSCHEMA,COMPANY,MIGRATION&$orderby=TIME_STAMP desc&$filter=(substringof('sfv4',COMPANYSCHEMA) or substringof('SFV4',COMPANYSCHEMA) or substringof('stockpm',COMPANYSCHEMA) or substringof('GLOBUSER_DVLHCM20S',COMPANYSCHEMA) or substringof('globuser_dvlhcm20s',COMPANYSCHEMA) or substringof('stockpm',COMPANYSCHEMA) or substringof('GLOBUSER_DVLHCM20S',COMPANYSCHEMA) or substringof('globuser_dvlhcm20s',COMPANYSCHEMA) or substringof('STOCKPM000110_REF2',COMPANYSCHEMA) or substringof('stockpm000110_ref2',COMPANYSCHEMA) or substringof('STOCKPM172200_REF2',COMPANYSCHEMA) or substringof('stockpm172200_ref2',COMPANYSCHEMA) or substringof('STOCKPM170737_REF',COMPANYSCHEMA) or substringof('stockpm170737_ref',COMPANYSCHEMA)    or substringof('DC',COMPANYSCHEMA) or substringof('dc',COMPANYSCHEMA) or substringof('STG',COMPANYSCHEMA) or substringof('stg',COMPANYSCHEMA) or substringof('HANAPM',COMPANYSCHEMA) or substringof('hanapm',COMPANYSCHEMA)) and COMPANYID ne 'PAYNGPPRL' and COMPANYID ne 'USBASEIAS22V1' and COMPANYID ne 'SAPSDCHXM0001' and COMPANYID ne 'PAYNGPPRLE' and COMPANYSCHEMA ne '' and COMPANY ne '' and COMPANY ne 'SAP SF Cloud Engineering' and FILEVERSION eq '" +
				// 	para + "' and TIME_STAMP ge datetime'" + fromCompDate + "' and TIME_STAMP le datetime'" + toCompDate + "'";
			} else {
				if(deployKey=="All"){
				var url =
					"/UpgradeCenterResult?$select=RESULT,UPGRADE_ELEMENT,COMPANYSCHEMA,COMPANY,MIGRATION&$orderby=TIME_STAMP desc&$filter=(substringof('sfv4',COMPANYSCHEMA) or substringof('SFV4',COMPANYSCHEMA) or substringof('STOCKPM',COMPANYSCHEMA) or substringof('GLOBUSER_DVLHCM20S',COMPANYSCHEMA) or substringof('globuser_dvlhcm20s',COMPANYSCHEMA) or substringof('stockpm',COMPANYSCHEMA) or substringof('GLOBUSER_DVLHCM20S',COMPANYSCHEMA) or substringof('globuser_dvlhcm20s',COMPANYSCHEMA) or substringof('STOCKPM000110_REF2',COMPANYSCHEMA) or substringof('stockpm000110_ref2',COMPANYSCHEMA) or substringof('STOCKPM172200_REF2',COMPANYSCHEMA) or substringof('stockpm172200_ref2',COMPANYSCHEMA) or substringof('STOCKPM170737_REF',COMPANYSCHEMA) or substringof('stockpm170737_ref',COMPANYSCHEMA)    or substringof('DC',COMPANYSCHEMA) or substringof('dc',COMPANYSCHEMA) or substringof('STG',COMPANYSCHEMA) or substringof('stg',COMPANYSCHEMA) or substringof('HANAPM',COMPANYSCHEMA) or substringof('hanapm',COMPANYSCHEMA)) and COMPANYID ne 'PAYNGPPRL' and COMPANYID ne 'USBASEIAS22V1' and COMPANYID ne 'SAPSDCHXM0001' and COMPANYID ne 'PAYNGPPRLE' and COMPANYSCHEMA ne '' and COMPANY ne '' and COMPANY ne 'SAP SF Cloud Engineering' and TIME_STAMP ge datetime'" +
					fromCompDate + "' and TIME_STAMP le datetime'" + toCompDate + "'";
				}else if(deployKey=="CUST"){
					var url =
					"/UpgradeCenterResult?$select=RESULT,UPGRADE_ELEMENT,COMPANYSCHEMA,COMPANY,MIGRATION&$orderby=TIME_STAMP desc&$filter=(substringof('sfv4',COMPANYSCHEMA) or substringof('SFV4',COMPANYSCHEMA) or substringof('STOCKPM',COMPANYSCHEMA) or substringof('GLOBUSER_DVLHCM20S',COMPANYSCHEMA) or substringof('globuser_dvlhcm20s',COMPANYSCHEMA) or substringof('stockpm',COMPANYSCHEMA) or substringof('GLOBUSER_DVLHCM20S',COMPANYSCHEMA) or substringof('globuser_dvlhcm20s',COMPANYSCHEMA) or substringof('STOCKPM000110_REF2',COMPANYSCHEMA) or substringof('stockpm000110_ref2',COMPANYSCHEMA) or substringof('STOCKPM172200_REF2',COMPANYSCHEMA) or substringof('stockpm172200_ref2',COMPANYSCHEMA) or substringof('STOCKPM170737_REF',COMPANYSCHEMA) or substringof('stockpm170737_ref',COMPANYSCHEMA)    or substringof('DC',COMPANYSCHEMA) or substringof('dc',COMPANYSCHEMA) or substringof('STG',COMPANYSCHEMA) or substringof('stg',COMPANYSCHEMA) or substringof('HANAPM',COMPANYSCHEMA) or substringof('hanapm',COMPANYSCHEMA)) and substringof('_',UPGRADE_ELEMENT) and COMPANYID ne 'PAYNGPPRL' and COMPANYID ne 'USBASEIAS22V1' and COMPANYID ne 'SAPSDCHXM0001' and COMPANYID ne 'PAYNGPPRLE' and COMPANYSCHEMA ne '' and COMPANY ne '' and COMPANY ne 'SAP SF Cloud Engineering' and TIME_STAMP ge datetime'" +
					fromCompDate + "' and TIME_STAMP le datetime'" + toCompDate + "'";
				}else{
				var url =
					"/UpgradeCenterResult?$select=RESULT,UPGRADE_ELEMENT,COMPANYSCHEMA,COMPANY,MIGRATION&$orderby=TIME_STAMP desc&$filter=(substringof('sfv4',COMPANYSCHEMA) or substringof('SFV4',COMPANYSCHEMA) or substringof('STOCKPM',COMPANYSCHEMA) or substringof('GLOBUSER_DVLHCM20S',COMPANYSCHEMA) or substringof('globuser_dvlhcm20s',COMPANYSCHEMA) or substringof('stockpm',COMPANYSCHEMA) or substringof('GLOBUSER_DVLHCM20S',COMPANYSCHEMA) or substringof('globuser_dvlhcm20s',COMPANYSCHEMA) or substringof('STOCKPM000110_REF2',COMPANYSCHEMA) or substringof('stockpm000110_ref2',COMPANYSCHEMA) or substringof('STOCKPM172200_REF2',COMPANYSCHEMA) or substringof('stockpm172200_ref2',COMPANYSCHEMA) or substringof('STOCKPM170737_REF',COMPANYSCHEMA) or substringof('stockpm170737_ref',COMPANYSCHEMA)    or substringof('DC',COMPANYSCHEMA) or substringof('dc',COMPANYSCHEMA) or substringof('STG',COMPANYSCHEMA) or substringof('stg',COMPANYSCHEMA) or substringof('HANAPM',COMPANYSCHEMA) or substringof('hanapm',COMPANYSCHEMA)) and indexof(UPGRADE_ELEMENT,'_') eq -1  and COMPANYID ne 'PAYNGPPRL' and COMPANYID ne 'USBASEIAS22V1' and COMPANYID ne 'SAPSDCHXM0001' and COMPANYID ne 'PAYNGPPRLE' and COMPANYSCHEMA ne '' and COMPANY ne '' and COMPANY ne 'SAP SF Cloud Engineering' and TIME_STAMP ge datetime'" +
					fromCompDate + "' and TIME_STAMP le datetime'" + toCompDate + "'";	
				}
				// var url =
				// 	"/UpgradeCenterResult?$select=UPGRADE_ELEMENT,COMPANYSCHEMA,COMPANY,MIGRATION&$orderby=TIME_STAMP desc&$filter=(substringof('sfv4',COMPANYSCHEMA) or substringof('SFV4',COMPANYSCHEMA) or substringof('stockpm',COMPANYSCHEMA) or substringof('GLOBUSER_DVLHCM20S',COMPANYSCHEMA) or substringof('globuser_dvlhcm20s',COMPANYSCHEMA) or substringof('stockpm',COMPANYSCHEMA) or substringof('GLOBUSER_DVLHCM20S',COMPANYSCHEMA) or substringof('globuser_dvlhcm20s',COMPANYSCHEMA) or substringof('STOCKPM000110_REF2',COMPANYSCHEMA) or substringof('stockpm000110_ref2',COMPANYSCHEMA) or substringof('STOCKPM172200_REF2',COMPANYSCHEMA) or substringof('stockpm172200_ref2',COMPANYSCHEMA) or substringof('STOCKPM170737_REF',COMPANYSCHEMA) or substringof('stockpm170737_ref',COMPANYSCHEMA)    or substringof('DC',COMPANYSCHEMA) or substringof('dc',COMPANYSCHEMA) or substringof('STG',COMPANYSCHEMA) or substringof('stg',COMPANYSCHEMA) or substringof('HANAPM',COMPANYSCHEMA) or substringof('hanapm',COMPANYSCHEMA)) and COMPANYID ne 'PAYNGPPRL' and COMPANYID ne 'USBASEIAS22V1' and COMPANYID ne 'SAPSDCHXM0001' and COMPANYID ne 'PAYNGPPRLE' and COMPANYSCHEMA ne '' and COMPANY ne '' and COMPANY ne 'SAP SF Cloud Engineering' and TIME_STAMP ge datetime'" +
				// 	fromCompDate + "' and TIME_STAMP le datetime'" + toCompDate + "'";
			}

			mdl.read(url, null, null, true,
				function(oData, oResponse) {
					if(oData.results.length>0){
						tempODATAPreCheck = oData.results;
						for (var q = 0; q < tempODATAPreCheck.length; q++) {
							
							
							// if (tempODATAPreCheck[q].RESULT == "true") {
								
							
							
							var majorBlk = tempODATAPreCheck[q].UPGRADE_ELEMENT.split("_");
							var lastItem = majorBlk[majorBlk.length-1];
							if(lastItem.length!=32){
								if(me.getView().byId("ddlProd").getSelectedKey()=="All"){
							
								
									tempODATAPreCheckFilter.push(tempODATAPreCheck[q]);
								}  else if(me.getView().byId("ddlProd").getSelectedKey()=="RM"){
			
									for(var a2=0;a2<datatempoModelUpgradeRecruitREC.length;a2++){
										
										if(tempODATAPreCheck[q].UPGRADE_ELEMENT.indexOf("_")==-1){
											
										
											if(tempODATAPreCheck[q].UPGRADE_ELEMENT==datatempoModelUpgradeRecruitREC[a2].UPGRADE_ELEMENT){
													// if(datatempoModelUpgradeRecruitREC[a2].PRODUCT=="Recruiting"){
														tempODATAPreCheckFilter.push(tempODATAPreCheck[q]);
														break;	
													// }
												}
											
										}else{
											var majorBlk = tempODATAPreCheck[q].UPGRADE_ELEMENT.split("_");
											var lastItem = majorBlk[majorBlk.length-1];
											if(lastItem.length==32){
												majorBlk.pop();
												var CompmajorBlk = majorBlk.join("_");
												if(CompmajorBlk==datatempoModelUpgradeRecruitREC[a2].UPGRADE_ELEMENT){
													// if(datatempoModelUpgradeRecruitREC[a2].PRODUCT=="Recruiting"){
														tempODATAPreCheckFilter.push(tempODATAPreCheck[q]);
														break;	
													// }
												}
											}else{
												majorBlk.pop();
												majorBlk.pop();
												var CompmajorBlk = majorBlk.join("_");
												if(CompmajorBlk==datatempoModelUpgradeRecruitREC[a2].UPGRADE_ELEMENT){
													// if(datatempoModelUpgradeRecruitREC[a2].PRODUCT=="Recruiting"){
														tempODATAPreCheckFilter.push(tempODATAPreCheck[q]);
														break;	
													// }
												}
											}
										}
										
										
										
										
										
									}
								}  else if(me.getView().byId("ddlProd").getSelectedKey()=="SM"){
									for(var a2=0;a2<datatempoModelUpgradeRecruitSM.length;a2++){
										
			// 							
										
										
											if(tempODATAPreCheck[q].UPGRADE_ELEMENT.indexOf("_")==-1){
												
										
											if(tempODATAPreCheck[q].UPGRADE_ELEMENT==datatempoModelUpgradeRecruitSM[a2].UPGRADE_ELEMENT){
													// if(oModelUpgradeRecruitData[a2].PRODUCT=="Succession Management"){
														tempODATAPreCheckFilter.push(tempODATAPreCheck[q]);
														break;	
													// }
												}
											
										}else{
											var majorBlk = tempODATAPreCheck[q].UPGRADE_ELEMENT.split("_");
											var lastItem = majorBlk[majorBlk.length-1];
											if(lastItem.length==32){
												majorBlk.pop();
												var CompmajorBlk = majorBlk.join("_");
												if(CompmajorBlk==datatempoModelUpgradeRecruitSM[a2].UPGRADE_ELEMENT){
													// if(oModelUpgradeRecruitData[a2].PRODUCT=="Succession Management"){
														tempODATAPreCheckFilter.push(tempODATAPreCheck[q]);
														break;	
													// }
												}
											}else{
												majorBlk.pop();
												majorBlk.pop();
												var CompmajorBlk = majorBlk.join("_");
												if(CompmajorBlk==datatempoModelUpgradeRecruitSM[a2].UPGRADE_ELEMENT){
													// if(oModelUpgradeRecruitData[a2].PRODUCT=="Succession Management"){
														tempODATAPreCheckFilter.push(tempODATAPreCheck[q]);
														break;	
													// }
												}
											}
										}
										
										
										
										
									}
								}  else if(me.getView().byId("ddlProd").getSelectedKey()=="PG"){
									for(var a2=0;a2<datatempoModelUpgradeRecruitPG.length;a2++){
										
										
									
										
										
										if(tempODATAPreCheck[q].UPGRADE_ELEMENT.indexOf("_")==-1){
										
												if(tempODATAPreCheck[q].UPGRADE_ELEMENT==datatempoModelUpgradeRecruitPG[a2].UPGRADE_ELEMENT){
													// if(oModelUpgradeRecruitData[a2].PRODUCT=="Performance and Goals"){
														tempODATAPreCheckFilter.push(tempODATAPreCheck[q]);
														break;	
													// }
												}
											
										}else{
											var majorBlk = tempODATAPreCheck[q].UPGRADE_ELEMENT.split("_");
											var lastItem = majorBlk[majorBlk.length-1];
											if(lastItem.length==32){
												majorBlk.pop();
												var CompmajorBlk = majorBlk.join("_");
												if(CompmajorBlk==datatempoModelUpgradeRecruitPG[a2].UPGRADE_ELEMENT){
													// if(oModelUpgradeRecruitData[a2].PRODUCT=="Performance and Goals"){
														tempODATAPreCheckFilter.push(tempODATAPreCheck[q]);
														break;	
													// }
												}
											}else{
												majorBlk.pop();
												majorBlk.pop();
												var CompmajorBlk = majorBlk.join("_");
												if(CompmajorBlk==datatempoModelUpgradeRecruitPG[a2].UPGRADE_ELEMENT){
													// if(oModelUpgradeRecruitData[a2].PRODUCT=="Performance and Goals"){
														tempODATAPreCheckFilter.push(tempODATAPreCheck[q]);
														break;	
													// }
												}
											}
										}
										
										
										
										
									}
								}  else if(me.getView().byId("ddlProd").getSelectedKey()=="CO"){
									for(var a2=0;a2<datatempoModelUpgradeRecruitCO.length;a2++){
										
									
			
										if(tempODATAPreCheck[q].UPGRADE_ELEMENT.indexOf("_")==-1){
											
										if(tempODATAPreCheck[q].UPGRADE_ELEMENT==datatempoModelUpgradeRecruitCO[a2].UPGRADE_ELEMENT){
											// if(oModelUpgradeRecruitData[a2].PRODUCT=="Compensation"){
												tempODATAPreCheckFilter.push(tempODATAPreCheck[q]);
												break;
											
											// }
											}
										
										}else{
											var majorBlk = tempODATAPreCheck[q].UPGRADE_ELEMENT.split("_");
											var lastItem = majorBlk[majorBlk.length-1];
											if(lastItem.length==32){
												majorBlk.pop();
												var CompmajorBlk = majorBlk.join("_");
												if(CompmajorBlk==datatempoModelUpgradeRecruitCO[a2].UPGRADE_ELEMENT){
													// if(oModelUpgradeRecruitData[a2].PRODUCT=="Compensation"){
														tempODATAPreCheckFilter.push(tempODATAPreCheck[q]);
														break;	
													// }
												}
											}else{
												majorBlk.pop();
												majorBlk.pop();
												var CompmajorBlk = majorBlk.join("_");
												if(CompmajorBlk==datatempoModelUpgradeRecruitCO[a2].UPGRADE_ELEMENT){
													// if(oModelUpgradeRecruitData[a2].PRODUCT=="Compensation"){
														tempODATAPreCheckFilter.push(tempODATAPreCheck[q]);
														break;	
													// }
												}
											}
										}
										
										
										
										
									}
								}  else if(me.getView().byId("ddlProd").getSelectedKey()=="ON"){
									for(var a2=0;a2<datatempoModelUpgradeRecruitON.length;a2++){
										
									
										
			
										if(tempODATAPreCheck[q].UPGRADE_ELEMENT.indexOf("_")==-1){
											
											if(tempODATAPreCheck[q].UPGRADE_ELEMENT==datatempoModelUpgradeRecruitON[a2].UPGRADE_ELEMENT){
											// if(oModelUpgradeRecruitData[a2].PRODUCT=="Onboarding" || oModelUpgradeRecruitData[a2].PRODUCT=="Onboarding 2.0"){
												tempODATAPreCheckFilter.push(tempODATAPreCheck[q]);
												break;
											// }
										}
										
											
										}else{
											var majorBlk = tempODATAPreCheck[q].UPGRADE_ELEMENT.split("_");
											var lastItem = majorBlk[majorBlk.length-1];
											if(lastItem.length==32){
												majorBlk.pop();
												var CompmajorBlk = majorBlk.join("_");
												if(CompmajorBlk==datatempoModelUpgradeRecruitON[a2].UPGRADE_ELEMENT){
													// if(oModelUpgradeRecruitData[a2].PRODUCT=="Onboarding" || oModelUpgradeRecruitData[a2].PRODUCT=="Onboarding 2.0"){
														tempODATAPreCheckFilter.push(tempODATAPreCheck[q]);
														break;	
													// }
												}
											}else{
												majorBlk.pop();
												majorBlk.pop();
												var CompmajorBlk = majorBlk.join("_");
												if(CompmajorBlk==datatempoModelUpgradeRecruitON[a2].UPGRADE_ELEMENT){
													// if(oModelUpgradeRecruitData[a2].PRODUCT=="Onboarding" || oModelUpgradeRecruitData[a2].PRODUCT=="Onboarding 2.0"){
														tempODATAPreCheckFilter.push(tempODATAPreCheck[q]);
														break;	
													// }
												}
											}
										}
										
										
										
									}
								}  else if(me.getView().byId("ddlProd").getSelectedKey()=="EC"){
									for(var a2=0; a2<datatempoModelUpgradeRecruitEC.length; a2++){
										
									// var datatempoModelUpgradeRecruitON = sap.ui.getCore().getModel("oModelUpgradeRecruitON").getData();
			// var datatempoModelUpgradeRecruitREC = sap.ui.getCore().getModel("oModelUpgradeRecruitREC").getData();
			// var datatempoModelUpgradeRecruitSM = sap.ui.getCore().getModel("oModelUpgradeRecruitSM").getData();
			// var datatempoModelUpgradeRecruitPG = sap.ui.getCore().getModel("oModelUpgradeRecruitPG").getData();
			// var datatempoModelUpgradeRecruitCO = sap.ui.getCore().getModel("oModelUpgradeRecruitCO").getData();
			// var datatempoModelUpgradeRecruitEC = sap.ui.getCore().getModel("oModelUpgradeRecruitEC").getData();
										
										
										if(tempODATAPreCheck[q].UPGRADE_ELEMENT.indexOf("_")==-1){
											
										
												if(tempODATAPreCheck[q].UPGRADE_ELEMENT==datatempoModelUpgradeRecruitEC[a2].UPGRADE_ELEMENT){
													// if(oModelUpgradeRecruitData[a2].PRODUCT=="Employee Central"){
														tempODATAPreCheckFilter.push(tempODATAPreCheck[q]);
														break;	
													// }
												}
											
										 
											
										}else{
											var majorBlk = tempODATAPreCheck[q].UPGRADE_ELEMENT.split("_");
											var lastItem = majorBlk[majorBlk.length-1];
											if(lastItem.length==32){
												majorBlk.pop();
												var CompmajorBlk = majorBlk.join("_");
												if(CompmajorBlk==datatempoModelUpgradeRecruitEC[a2].UPGRADE_ELEMENT){
													// if(datatempoModelUpgradeRecruitEC[a2].PRODUCT=="Employee Central"){
														tempODATAPreCheckFilter.push(tempODATAPreCheck[q]);
														break;	
													// }
												}
											}else{
												majorBlk.pop();
												majorBlk.pop();
												var CompmajorBlk = majorBlk.join("_");
												if(CompmajorBlk==datatempoModelUpgradeRecruitEC[a2].UPGRADE_ELEMENT){
													// if(oModelUpgradeRecruitData[a2].PRODUCT=="Employee Central"){
														tempODATAPreCheckFilter.push(tempODATAPreCheck[q]);
														break;	
													// }
												}
											}
										}
									}
								}
							}
							
							// }
						
						}
						if (tempODATAPreCheckFilter.length > 0) {
						var tempODATA = [];
						var tempODATABP = [];
						var tempTotalMig = [];
						var tempTotalNonMig = [];
						var count = 0;
						var countBP = 0;
						var countMig = 0;
						var countNonMig = 0;
						for (var q = 0; q < tempODATAPreCheckFilter.length; q++) {
							// if(tempODATAPreCheckFilter[q].COMPANY=="CRUZ ROJA ESPAÑOLA"){
							// 	tempODATAPreCheckFilter[q].COMPANY="CRUZ ROJA ESPAÑOLA DESARROLLO";
							// }
							// if(tempODATAPreCheckFilter[q].COMPANY=="Release"){
							// 	tempODATAPreCheckFilter[q].COMPANY="Stericycle Inc (de)";
							// }
							if(tempODATAPreCheckFilter[q].COMPANY!="BPMCINSTANCE4" && tempODATAPreCheckFilter[q].COMPANY!="BPMCINSTANCE1"){
								if (tempODATAPreCheckFilter[q].COMPANYSCHEMA != null && tempODATAPreCheckFilter[q].COMPANYSCHEMA.toLowerCase().indexOf("sfsales")==-1) {
								// if (tempODATAPreCheckFilter[q].COMPANYSCHEMA.toLowerCase().indexOf("sfv4") > -1 || tempODATAPreCheckFilter[q].COMPANYSCHEMA.toLowerCase().indexOf("hanapm") > -1 || tempODATAPreCheckFilter[q].COMPANYSCHEMA.toLowerCase().indexOf(
								// 		"stg") > -1 || tempODATAPreCheckFilter[q].COMPANYSCHEMA.toLowerCase().indexOf("stockpm172200_ref2") > -1 || tempODATAPreCheckFilter[q].COMPANYSCHEMA.toLowerCase().indexOf("dc") > -1) {
									// if(tempODATAPreCheckFilter[q].COMPANY.toLowerCase().indexOf("test")===-1 && tempODATAPreCheckFilter[q].COMPANY.toLowerCase().indexOf("demo")===-1){
									// tempODATA.push({
									// 	'Customer':tempODATAPreCheckFilter[q].COMPANY,
									// 	'Schema':tempODATAPreCheckFilter[q].COMPANYSCHEMA
									// });
									tempODATA.push(
										tempODATAPreCheckFilter[q].COMPANY
									);
									// tempODATABP.push({
									// 	compny: tempODATAPreCheckFilter[q].COMPANY,
									// 	ele: tempODATAPreCheckFilter[q].UPGRADE_ELEMENT
									// });
									// if (tempODATAPreCheckFilter[q].MIGRATION == "true") {
									// 	tempTotalMig.push({
									// 		cmpny: tempODATAPreCheckFilter[q].COMPANY,
									// 		migration: tempODATAPreCheckFilter[q].MIGRATION
									// 	});
									// } else if (tempODATAPreCheckFilter[q].MIGRATION == "false") {
									// 	tempTotalNonMig.push({
									// 		cmpny: tempODATAPreCheckFilter[q].COMPANY,
									// 		migration: tempODATAPreCheckFilter[q].MIGRATION
									// 	});
									// }
									// }
								// }
							}
							}
						}

						// var uniqueBP = [];
						// $.each(tempODATABP, function(i, e) {
						// 	var matchingItems = $.grep(uniqueBP, function(item) {
						// 		return item.compny === e.compny && item.ele === e.ele;
						// 	});
						// 	if (matchingItems.length === 0) {
						// 		uniqueBP.push(e);
						// 	}
						// });

						// var uniqueMig = [];
						// $.each(tempTotalMig, function(i, e) {
						// 	var matchingItems = $.grep(uniqueMig, function(item) {
						// 		return item.cmpny === e.cmpny && item.migration === e.migration;
						// 	});
						// 	if (matchingItems.length === 0) {
						// 		uniqueMig.push(e);
						// 	}
						// });

						// var uniqueNonMig = [];
						// $.each(tempTotalNonMig, function(i, e) {
						// 	var matchingItems = $.grep(uniqueNonMig, function(item) {
						// 		return item.cmpny === e.cmpny && item.migration === e.migration;
						// 	});
						// 	if (matchingItems.length === 0) {
						// 		uniqueNonMig.push(e);
						// 	}
						// });
						// var counter = 0;
						// for (var j = 0; j < uniqueMig.length; j++) {
						// 	for (var t = 0; t < uniqueNonMig.length; t++) {
						// 		if (uniqueMig[j].cmpny == uniqueNonMig[t].cmpny) {
						// 			counter++;
						// 		}
						// 	}
						// }

						var unique = tempODATA.filter(function(itm, i, tempODATA) {
							return i == tempODATA.indexOf(itm);
						});

						// var uniqueBP = tempODATABP.filter(function(itm, i, tempODATABP) {
						//     return i == tempODATABP.indexOf(itm);
						// });

						// var oModelMDF = new sap.ui.model.json.JSONModel();
						// sap.ui.getCore().setModel(oModelMDF, "oModelMDF");

						// var oModelLegacy = new sap.ui.model.json.JSONModel();
						// sap.ui.getCore().setModel(oModelLegacy, "oModelLegacy");

						// var oDataMdf = {
						// 	"stlistMDF": tempTimeAry
						// };
						// oModelMDF.setData(uniqueMig);
						// oModelLegacy.setData(uniqueNonMig);


						// countMig = me.NumberFormat(Math.round(uniqueMig.length));
						// me.getView().byId("migratedCount").setText(countMig["value"] + countMig["type"]);

						// countNonMig = me.NumberFormat(Math.round(uniqueNonMig.length - counter));
						// me.getView().byId("nonmigratedCount").setText(countNonMig["value"] + countNonMig["type"]);

						count = me.NumberFormat(Math.round(unique.length));
						me.getView().byId("subTextSmallTiles1Top").setValue(count["value"]);
						me.getView().byId("subTextSmallTiles1Top").setScale(count["type"]);
						
						me.getView().byId("noCustValSubAction").setValue(parseInt(count["value"]));
						
						window.CountGlbl = me.NumberFormatOpp(count); 

						// countBP = me.NumberFormat(Math.round(uniqueBP.length));
						// me.getView().byId("subTextSmallTiles2Top").setText(countBP["value"]+countBP["type"]);

						// $("#repoContainerReview").find("svg").remove();

						// // Radialize the colors
						// Highcharts.setOptions({
						// 	colors: Highcharts.map(['#5EBB4B', '#6586AD'], function(color) {
						// 		return {
						// 			radialGradient: {
						// 				cx: 0.5,
						// 				cy: 0.3,
						// 				r: 0.7
						// 			},
						// 			stops: [
						// 				[0, color],
						// 				[1, Highcharts.Color(color).brighten(-0.3).get('rgb')] // darken
						// 			]
						// 		};
						// 	})
						// });

						// Highcharts.SVGRenderer.prototype.symbols.download = function(x, y, w, h) {
						// 	var path = [
						// 		// Arrow stem
						// 		'M', x + w * 0.5, y,
						// 		'L', x + w * 0.5, y + h * 0.7,
						// 		// Arrow head
						// 		'M', x + w * 0.3, y + h * 0.5,
						// 		'L', x + w * 0.5, y + h * 0.7,
						// 		'L', x + w * 0.7, y + h * 0.5,
						// 		// Box
						// 		'M', x, y + h * 0.9,
						// 		'L', x, y + h,
						// 		'L', x + w, y + h,
						// 		'L', x + w, y + h * 0.9
						// 	];
						// 	return path;
						// };

						// Highcharts.chart('repoContainerReview', {
						// 	chart: {
						// 		plotBackgroundColor: "transparent",
						// 		plotBorderWidth: null,
						// 		plotShadow: false,
						// 		type: 'pie',
						// 		options3d: {
						//             enabled: true,
						//             alpha: 45
						//         },
						// 		height: '110',
						// 		// width: '300'
						// 	},
						// 	// colors:['#90EE7E','#6586AD'],
						// 	title: {
						// 		text: ''
						// 	},
						// 	tooltip: {
						// 		pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
						// 	},
						// 	plotOptions: {
						// 		pie: {
						// 			allowPointSelect: true,
						// 			cursor: 'pointer',
						// 			depth: 25,
						// 			dataLabels: {
						// 				enabled: true,
						// 				format: '<b>{point.name}</b>: {point.percentage:.1f} %',
						// 				// style: {
						// 				// 	color: ['#ddd']
						// 				// },
						// 				style: {
						// 					color: ['#ddd'],
						// 					fontSize:"10.5px"
						// 				},
						// 	            distance: 20
						// 			}
						// 		},
						// 		series: {
						// 			states: {
						// 				select: {
						// 					color: '#63e5e4'
						// 				}
						// 			}
						// 		}
						// 	},
						// 	series: [{
						// 		name: 'Pick List',
						// 		// colorByPoint: true,
						// 		size: '100%',
						// 		innerSize: '50%',
						// 		data: [{
						// 			name: 'MDF',
						// 			y: parseFloat(countMig["value"]),

						// 		}, {
						// 			name: 'Legacy',
						// 			y: parseFloat(countNonMig["value"])
						// 		}],
						// 		point: {
						// 			events: {
						// 				click: function(event) {
						// 					//alert(this.name);
						// 					var chartArea = $("#repoContainerReviewArea").highcharts();
						// 					var selectedPointsArea = chartArea.getSelectedPoints();
						// 					if(selectedPointsArea.length>0){
						// 						selectedPointsArea[0].select();	
						// 					}
						// 					var chartDay = $("#repoContainerReviewAreaDay").highcharts();
						// 					var selectedPointsDay = chartDay.getSelectedPoints();
						// 					if(selectedPointsDay.length>0){
						// 						selectedPointsDay[0].select();	
						// 					}
						// 			        // selectedPointsArea[0].select();
									        
						// 					me.getView().byId("HBarChart").vizSelection([], {
						// 						"clearSelection": true
						// 					});
						// 					var aFilters = [];

						// 					// update list binding
						// 					var list = me.getView().byId("listTable");
						// 					var binding = list.getBinding("items");
						// 					binding.filter(aFilters, "Application");

						// 					if (this.name == "MDF") {

						// 						if (this.selected == false || this.selected == undefined) {
													
						// 							if (window.glblFlag == true) {
						// 								setTimeout(function() {

						// 									var oModelMDFData = sap.ui.getCore().getModel("oModelMDF").getData();
						// 									var aFilters = [];

						// 									for (var j = 0; j < oModelMDFData.length; j++) {
						// 										// var filter = new sap.ui.model.Filter("val", sap.ui.model.FilterOperator.Contains, oModelMDFData[j].cmpny);
						// 										var filter = new sap.ui.model.Filter("val", sap.ui.model.FilterOperator.EQ, oModelMDFData[j].cmpny);
						// 										aFilters.push(filter);
						// 									}

						// 									// update list binding
						// 									var list = me.getView().byId("listTable");
						// 									var binding = list.getBinding("items");
						// 									binding.filter(aFilters, "Application");
						// 								}, 100);
						// 							} else {

						// 								var oModelMDFData = sap.ui.getCore().getModel("oModelMDF").getData();
						// 								var aFilters = [];

						// 								for (var j = 0; j < oModelMDFData.length; j++) {
						// 									// var filter = new sap.ui.model.Filter("val", sap.ui.model.FilterOperator.Contains, oModelMDFData[j].cmpny);
						// 									var filter = new sap.ui.model.Filter("val", sap.ui.model.FilterOperator.EQ, oModelMDFData[j].cmpny);
						// 									aFilters.push(filter);
						// 								}
														
														

						// 								// update list binding
						// 								var list = me.getView().byId("listTable");
						// 								var binding = list.getBinding("items");
						// 								binding.filter(aFilters, "Application");
						// 							}
						// 							me.getView().byId("filterLabel").setText("MDF Customers");
						// 							me.getView().byId("cancelBtn").setVisible(true);
						// 						} else {
						// 							var aFilters = [];
						// 							me.getView().byId("filterLabel").setText("All Customers");
						// 							me.getView().byId("cancelBtn").setVisible(false);
						// 							// update list binding
						// 							var list = me.getView().byId("listTable");
						// 							var binding = list.getBinding("items");
						// 							binding.filter(aFilters, "Application");
						// 						}
						// 					} else if (this.name == "Legacy") {
						// 						if (this.selected == false || this.selected == undefined) {
													
						// 							if (window.glblFlag == true) {
						// 								setTimeout(function() {

						// 									var oModelLegacyData = sap.ui.getCore().getModel("oModelLegacy").getData();
						// 									var aFilters = [];
		
						// 									for (var j = 0; j < oModelLegacyData.length; j++) {
						// 										// var filter = new sap.ui.model.Filter("val", sap.ui.model.FilterOperator.Contains, oModelLegacyData[j].cmpny);
						// 										var filter = new sap.ui.model.Filter("val", sap.ui.model.FilterOperator.EQ, oModelLegacyData[j].cmpny);
						// 										aFilters.push(filter);
						// 									}
		
						// 									// update list binding
						// 									var list = me.getView().byId("listTable");
						// 									var binding = list.getBinding("items");
						// 									binding.filter(aFilters, "Application");
						// 								}, 100);
						// 							} else {

						// 								var oModelLegacyData = sap.ui.getCore().getModel("oModelLegacy").getData();
						// 								var aFilters = [];
	
						// 								for (var j = 0; j < oModelLegacyData.length; j++) {
						// 									// var filter = new sap.ui.model.Filter("val", sap.ui.model.FilterOperator.Contains, oModelLegacyData[j].cmpny);
						// 									var filter = new sap.ui.model.Filter("val", sap.ui.model.FilterOperator.EQ, oModelLegacyData[j].cmpny);
						// 									aFilters.push(filter);
						// 								}
	
						// 								// update list binding
						// 								var list = me.getView().byId("listTable");
						// 								var binding = list.getBinding("items");
						// 								binding.filter(aFilters, "Application");
						// 							}
						// 							me.getView().byId("filterLabel").setText("Legacy Customers");
						// 							me.getView().byId("cancelBtn").setVisible(true);
						// 						} else {
						// 							var aFilters = [];
						// 							me.getView().byId("filterLabel").setText("All Customers");
						// 							me.getView().byId("cancelBtn").setVisible(false);
						// 							// update list binding
						// 							var list = me.getView().byId("listTable");
						// 							var binding = list.getBinding("items");
						// 							binding.filter(aFilters, "Application");
						// 						}

						// 					}
						// 				}
						// 			}
						// 		}
						// 	}],
						// 	navigation: {
						// 		buttonOptions: {
						// 			verticalAlign: 'top',
						// 			x: 15,
						// 			y: -10
						// 		},
						// 		menuStyle: {
						// 			background: '#555'
						// 		},
						// 		menuItemStyle: {
						// 			color: '#ddd'
						// 		}
						// 	},
						// 	credits: {
						// 		enabled: false
						// 	},
						// 	exporting: {
						// 		chartOptions: {
						// 			chart: {
						// 				backgroundColor: '#555'
						// 			}
						// 		},
						// 		buttons: {
						// 			contextButton: {
						// 				symbol: 'download',
						// 				symbolFill: '#ddd'
						// 			}
						// 		},
						// 		filename: 'Picklist Migration Chart'
						// 	}

						// });

					}
					}else{
						// me.getView().byId("migratedCount").setText("");
						// me.getView().byId("nonmigratedCount").setText("");
						me.getView().byId("subTextSmallTiles1Top").setValue(0);
						me.getView().byId("noCustValSubAction").setValue(0);
						// $("#repoContainerReview").find("svg").remove();
					}
				},
				function(oError) {
					console.log("Error 127");
				});

		},
		
		loadDailyChart: function(mdl,para){
			var Datetoday = new Date();
			var fromDate = new Date();
			fromDate.setDate((fromDate.getDate() - 30) );

			var fromCompDateAll = fromDate.toISOString();
			var toCompDateTemp = Datetoday.toISOString();

			fromCompDateAll = fromCompDateAll.split("T")[0] + "T00:00";
			toCompDateTemp = toCompDateTemp.split("T")[0] + "T24:00";
			var tempDateTo = (new Date(toCompDateTemp)).getDate();
			var d = new Date(toCompDateTemp);
			d.setDate(tempDateTo);
			var toCompDateAll = d.toISOString();
			toCompDateAll = toCompDateAll.split("T")[0] + "T24:00";

			var tempDateRef = [];
			var oDataCHSTLineRef = {};
			var inputFeedArryRef = [];
			var oModelLineChartDaily = new sap.ui.model.json.JSONModel();
			sap.ui.getCore().setModel(oModelLineChartDaily, "oModelLineChartDaily");
			var me = this;
			
			var tempODATAPreCheck = [];
			var tempODATAPreCheckFilter = [];
			// var oModelUpgradeRecruitData = sap.ui.getCore().getModel("oModelUpgradeRecruit").getData();
			
			var datatempoModelUpgradeRecruitON = sap.ui.getCore().getModel("oModelUpgradeRecruitON").getData();
			var datatempoModelUpgradeRecruitREC = sap.ui.getCore().getModel("oModelUpgradeRecruitREC").getData();
			var datatempoModelUpgradeRecruitSM = sap.ui.getCore().getModel("oModelUpgradeRecruitSM").getData();
			var datatempoModelUpgradeRecruitPG = sap.ui.getCore().getModel("oModelUpgradeRecruitPG").getData();
			var datatempoModelUpgradeRecruitCO = sap.ui.getCore().getModel("oModelUpgradeRecruitCO").getData();
			var datatempoModelUpgradeRecruitEC = sap.ui.getCore().getModel("oModelUpgradeRecruitEC").getData();
			
			
			var deployKey = me.getView().byId("ddlDeploy").getSelectedKey();

			if (para != "") {
				if(deployKey=="All"){
				var url =
					"/UpgradeCenterResult?$select=COMPANY,UPGRADE_ELEMENT,COMPANYSCHEMA,TIME_STAMP&$orderby=TIME_STAMP desc&$filter=(substringof('sfv4',COMPANYSCHEMA) or substringof('SFV4',COMPANYSCHEMA) or substringof('STOCKPM',COMPANYSCHEMA) or substringof('GLOBUSER_DVLHCM20S',COMPANYSCHEMA) or substringof('globuser_dvlhcm20s',COMPANYSCHEMA) or substringof('stockpm',COMPANYSCHEMA) or substringof('GLOBUSER_DVLHCM20S',COMPANYSCHEMA) or substringof('globuser_dvlhcm20s',COMPANYSCHEMA) or substringof('STOCKPM000110_REF2',COMPANYSCHEMA) or substringof('stockpm000110_ref2',COMPANYSCHEMA) or substringof('STOCKPM172200_REF2',COMPANYSCHEMA) or substringof('stockpm172200_ref2',COMPANYSCHEMA) or substringof('STOCKPM170737_REF',COMPANYSCHEMA) or substringof('stockpm170737_ref',COMPANYSCHEMA)    or substringof('DC',COMPANYSCHEMA) or substringof('dc',COMPANYSCHEMA) or substringof('STG',COMPANYSCHEMA) or substringof('stg',COMPANYSCHEMA) or substringof('HANAPM',COMPANYSCHEMA) or substringof('hanapm',COMPANYSCHEMA)) and COMPANYID ne 'PAYNGPPRL' and COMPANYID ne 'USBASEIAS22V1' and COMPANYID ne 'SAPSDCHXM0001' and COMPANYID ne 'PAYNGPPRLE' and COMPANYSCHEMA ne '' and COMPANY ne '' and COMPANY ne 'SAP SF Cloud Engineering' and FILEVERSION eq '" +
					para + "' and TIME_STAMP ge datetime'" + fromCompDateAll + "' and TIME_STAMP le datetime'" + toCompDateAll + "'";
				}else if(deployKey=="CUST"){
					var url =
					"/UpgradeCenterResult?$select=COMPANY,UPGRADE_ELEMENT,COMPANYSCHEMA,TIME_STAMP&$orderby=TIME_STAMP desc&$filter=(substringof('sfv4',COMPANYSCHEMA) or substringof('SFV4',COMPANYSCHEMA) or substringof('STOCKPM',COMPANYSCHEMA) or substringof('GLOBUSER_DVLHCM20S',COMPANYSCHEMA) or substringof('globuser_dvlhcm20s',COMPANYSCHEMA) or substringof('stockpm',COMPANYSCHEMA) or substringof('GLOBUSER_DVLHCM20S',COMPANYSCHEMA) or substringof('globuser_dvlhcm20s',COMPANYSCHEMA) or substringof('STOCKPM000110_REF2',COMPANYSCHEMA) or substringof('stockpm000110_ref2',COMPANYSCHEMA) or substringof('STOCKPM172200_REF2',COMPANYSCHEMA) or substringof('stockpm172200_ref2',COMPANYSCHEMA) or substringof('STOCKPM170737_REF',COMPANYSCHEMA) or substringof('stockpm170737_ref',COMPANYSCHEMA)    or substringof('DC',COMPANYSCHEMA) or substringof('dc',COMPANYSCHEMA) or substringof('STG',COMPANYSCHEMA) or substringof('stg',COMPANYSCHEMA) or substringof('HANAPM',COMPANYSCHEMA) or substringof('hanapm',COMPANYSCHEMA)) and substringof('_',UPGRADE_ELEMENT) and COMPANYID ne 'PAYNGPPRL' and COMPANYID ne 'USBASEIAS22V1' and COMPANYID ne 'SAPSDCHXM0001' and COMPANYID ne 'PAYNGPPRLE' and COMPANYSCHEMA ne '' and COMPANY ne '' and COMPANY ne 'SAP SF Cloud Engineering' and FILEVERSION eq '" +
					para + "' and TIME_STAMP ge datetime'" + fromCompDateAll + "' and TIME_STAMP le datetime'" + toCompDateAll + "'";
				}else{
				var url =
					"/UpgradeCenterResult?$select=COMPANY,UPGRADE_ELEMENT,COMPANYSCHEMA,TIME_STAMP&$orderby=TIME_STAMP desc&$filter=(substringof('sfv4',COMPANYSCHEMA) or substringof('SFV4',COMPANYSCHEMA) or substringof('STOCKPM',COMPANYSCHEMA) or substringof('GLOBUSER_DVLHCM20S',COMPANYSCHEMA) or substringof('globuser_dvlhcm20s',COMPANYSCHEMA) or substringof('stockpm',COMPANYSCHEMA) or substringof('GLOBUSER_DVLHCM20S',COMPANYSCHEMA) or substringof('globuser_dvlhcm20s',COMPANYSCHEMA) or substringof('STOCKPM000110_REF2',COMPANYSCHEMA) or substringof('stockpm000110_ref2',COMPANYSCHEMA) or substringof('STOCKPM172200_REF2',COMPANYSCHEMA) or substringof('stockpm172200_ref2',COMPANYSCHEMA) or substringof('STOCKPM170737_REF',COMPANYSCHEMA) or substringof('stockpm170737_ref',COMPANYSCHEMA)    or substringof('DC',COMPANYSCHEMA) or substringof('dc',COMPANYSCHEMA) or substringof('STG',COMPANYSCHEMA) or substringof('stg',COMPANYSCHEMA) or substringof('HANAPM',COMPANYSCHEMA) or substringof('hanapm',COMPANYSCHEMA)) and indexof(UPGRADE_ELEMENT,'_') eq -1  and COMPANYID ne 'PAYNGPPRL' and COMPANYID ne 'USBASEIAS22V1' and COMPANYID ne 'SAPSDCHXM0001' and COMPANYID ne 'PAYNGPPRLE' and COMPANYSCHEMA ne '' and COMPANY ne '' and COMPANY ne 'SAP SF Cloud Engineering' and FILEVERSION eq '" +
					para + "' and TIME_STAMP ge datetime'" + fromCompDateAll + "' and TIME_STAMP le datetime'" + toCompDateAll + "'";	
				}
				// var url =
				// 	"/UpgradeCenterResult?$select=COMPANY,UPGRADE_ELEMENT,COMPANYSCHEMA,TIME_STAMP&$orderby=TIME_STAMP desc&$filter=(substringof('sfv4',COMPANYSCHEMA) or substringof('SFV4',COMPANYSCHEMA) or substringof('stockpm',COMPANYSCHEMA) or substringof('GLOBUSER_DVLHCM20S',COMPANYSCHEMA) or substringof('globuser_dvlhcm20s',COMPANYSCHEMA) or substringof('stockpm',COMPANYSCHEMA) or substringof('GLOBUSER_DVLHCM20S',COMPANYSCHEMA) or substringof('globuser_dvlhcm20s',COMPANYSCHEMA) or substringof('STOCKPM000110_REF2',COMPANYSCHEMA) or substringof('stockpm000110_ref2',COMPANYSCHEMA) or substringof('STOCKPM172200_REF2',COMPANYSCHEMA) or substringof('stockpm172200_ref2',COMPANYSCHEMA) or substringof('STOCKPM170737_REF',COMPANYSCHEMA) or substringof('stockpm170737_ref',COMPANYSCHEMA)    or substringof('DC',COMPANYSCHEMA) or substringof('dc',COMPANYSCHEMA) or substringof('STG',COMPANYSCHEMA) or substringof('stg',COMPANYSCHEMA) or substringof('HANAPM',COMPANYSCHEMA) or substringof('hanapm',COMPANYSCHEMA)) and COMPANYID ne 'PAYNGPPRL' and COMPANYID ne 'USBASEIAS22V1' and COMPANYID ne 'SAPSDCHXM0001' and COMPANYID ne 'PAYNGPPRLE' and COMPANYSCHEMA ne '' and COMPANY ne '' and COMPANY ne 'SAP SF Cloud Engineering' and FILEVERSION eq '" +
				// 	para + "' and TIME_STAMP ge datetime'" + fromCompDateAll + "' and TIME_STAMP le datetime'" + toCompDateAll + "'";
			} else {
				if(deployKey=="All"){
				var url =
					"/UpgradeCenterResult?$select=COMPANY,UPGRADE_ELEMENT,COMPANYSCHEMA,TIME_STAMP&$orderby=TIME_STAMP desc&$filter=(substringof('sfv4',COMPANYSCHEMA) or substringof('SFV4',COMPANYSCHEMA) or substringof('STOCKPM',COMPANYSCHEMA) or substringof('GLOBUSER_DVLHCM20S',COMPANYSCHEMA) or substringof('globuser_dvlhcm20s',COMPANYSCHEMA) or substringof('stockpm',COMPANYSCHEMA) or substringof('GLOBUSER_DVLHCM20S',COMPANYSCHEMA) or substringof('globuser_dvlhcm20s',COMPANYSCHEMA) or substringof('STOCKPM000110_REF2',COMPANYSCHEMA) or substringof('stockpm000110_ref2',COMPANYSCHEMA) or substringof('STOCKPM172200_REF2',COMPANYSCHEMA) or substringof('stockpm172200_ref2',COMPANYSCHEMA) or substringof('STOCKPM170737_REF',COMPANYSCHEMA) or substringof('stockpm170737_ref',COMPANYSCHEMA)    or substringof('DC',COMPANYSCHEMA) or substringof('dc',COMPANYSCHEMA) or substringof('STG',COMPANYSCHEMA) or substringof('stg',COMPANYSCHEMA) or substringof('HANAPM',COMPANYSCHEMA) or substringof('hanapm',COMPANYSCHEMA)) and COMPANYID ne 'PAYNGPPRL' and COMPANYID ne 'USBASEIAS22V1' and COMPANYID ne 'SAPSDCHXM0001' and COMPANYID ne 'PAYNGPPRLE' and COMPANYSCHEMA ne '' and COMPANY ne '' and COMPANY ne 'SAP SF Cloud Engineering' and TIME_STAMP ge datetime'" +
					fromCompDateAll + "' and TIME_STAMP le datetime'" + toCompDateAll + "'";
				}else if(deployKey=="CUST"){
					var url =
					"/UpgradeCenterResult?$select=COMPANY,UPGRADE_ELEMENT,COMPANYSCHEMA,TIME_STAMP&$orderby=TIME_STAMP desc&$filter=(substringof('sfv4',COMPANYSCHEMA) or substringof('SFV4',COMPANYSCHEMA) or substringof('STOCKPM',COMPANYSCHEMA) or substringof('GLOBUSER_DVLHCM20S',COMPANYSCHEMA) or substringof('globuser_dvlhcm20s',COMPANYSCHEMA) or substringof('stockpm',COMPANYSCHEMA) or substringof('GLOBUSER_DVLHCM20S',COMPANYSCHEMA) or substringof('globuser_dvlhcm20s',COMPANYSCHEMA) or substringof('STOCKPM000110_REF2',COMPANYSCHEMA) or substringof('stockpm000110_ref2',COMPANYSCHEMA) or substringof('STOCKPM172200_REF2',COMPANYSCHEMA) or substringof('stockpm172200_ref2',COMPANYSCHEMA) or substringof('STOCKPM170737_REF',COMPANYSCHEMA) or substringof('stockpm170737_ref',COMPANYSCHEMA)    or substringof('DC',COMPANYSCHEMA) or substringof('dc',COMPANYSCHEMA) or substringof('STG',COMPANYSCHEMA) or substringof('stg',COMPANYSCHEMA) or substringof('HANAPM',COMPANYSCHEMA) or substringof('hanapm',COMPANYSCHEMA)) and substringof('_',UPGRADE_ELEMENT) and COMPANYID ne 'PAYNGPPRL' and COMPANYID ne 'USBASEIAS22V1' and COMPANYID ne 'SAPSDCHXM0001' and COMPANYID ne 'PAYNGPPRLE' and COMPANYSCHEMA ne '' and COMPANY ne '' and COMPANY ne 'SAP SF Cloud Engineering' and TIME_STAMP ge datetime'" +
					fromCompDateAll + "' and TIME_STAMP le datetime'" + toCompDateAll + "'";
				}else{
				var url =
					"/UpgradeCenterResult?$select=COMPANY,UPGRADE_ELEMENT,COMPANYSCHEMA,TIME_STAMP&$orderby=TIME_STAMP desc&$filter=(substringof('sfv4',COMPANYSCHEMA) or substringof('SFV4',COMPANYSCHEMA) or substringof('STOCKPM',COMPANYSCHEMA) or substringof('GLOBUSER_DVLHCM20S',COMPANYSCHEMA) or substringof('globuser_dvlhcm20s',COMPANYSCHEMA) or substringof('stockpm',COMPANYSCHEMA) or substringof('GLOBUSER_DVLHCM20S',COMPANYSCHEMA) or substringof('globuser_dvlhcm20s',COMPANYSCHEMA) or substringof('STOCKPM000110_REF2',COMPANYSCHEMA) or substringof('stockpm000110_ref2',COMPANYSCHEMA) or substringof('STOCKPM172200_REF2',COMPANYSCHEMA) or substringof('stockpm172200_ref2',COMPANYSCHEMA) or substringof('STOCKPM170737_REF',COMPANYSCHEMA) or substringof('stockpm170737_ref',COMPANYSCHEMA)    or substringof('DC',COMPANYSCHEMA) or substringof('dc',COMPANYSCHEMA) or substringof('STG',COMPANYSCHEMA) or substringof('stg',COMPANYSCHEMA) or substringof('HANAPM',COMPANYSCHEMA) or substringof('hanapm',COMPANYSCHEMA)) and indexof(UPGRADE_ELEMENT,'_') eq -1  and COMPANYID ne 'PAYNGPPRL' and COMPANYID ne 'USBASEIAS22V1' and COMPANYID ne 'SAPSDCHXM0001' and COMPANYID ne 'PAYNGPPRLE' and COMPANYSCHEMA ne '' and COMPANY ne '' and COMPANY ne 'SAP SF Cloud Engineering' and TIME_STAMP ge datetime'" +
					fromCompDateAll + "' and TIME_STAMP le datetime'" + toCompDateAll + "'";	
				}
				// var url =
				// 	"/UpgradeCenterResult?$select=COMPANY,UPGRADE_ELEMENT,COMPANYSCHEMA,TIME_STAMP&$orderby=TIME_STAMP desc&$filter=(substringof('sfv4',COMPANYSCHEMA) or substringof('SFV4',COMPANYSCHEMA) or substringof('stockpm',COMPANYSCHEMA) or substringof('GLOBUSER_DVLHCM20S',COMPANYSCHEMA) or substringof('globuser_dvlhcm20s',COMPANYSCHEMA) or substringof('stockpm',COMPANYSCHEMA) or substringof('GLOBUSER_DVLHCM20S',COMPANYSCHEMA) or substringof('globuser_dvlhcm20s',COMPANYSCHEMA) or substringof('STOCKPM000110_REF2',COMPANYSCHEMA) or substringof('stockpm000110_ref2',COMPANYSCHEMA) or substringof('STOCKPM172200_REF2',COMPANYSCHEMA) or substringof('stockpm172200_ref2',COMPANYSCHEMA) or substringof('STOCKPM170737_REF',COMPANYSCHEMA) or substringof('stockpm170737_ref',COMPANYSCHEMA)    or substringof('DC',COMPANYSCHEMA) or substringof('dc',COMPANYSCHEMA) or substringof('STG',COMPANYSCHEMA) or substringof('stg',COMPANYSCHEMA) or substringof('HANAPM',COMPANYSCHEMA) or substringof('hanapm',COMPANYSCHEMA)) and COMPANYID ne 'PAYNGPPRL' and COMPANYID ne 'USBASEIAS22V1' and COMPANYID ne 'SAPSDCHXM0001' and COMPANYID ne 'PAYNGPPRLE' and COMPANYSCHEMA ne '' and COMPANY ne '' and COMPANY ne 'SAP SF Cloud Engineering' and TIME_STAMP ge datetime'" +
				// 	fromCompDateAll + "' and TIME_STAMP le datetime'" + toCompDateAll + "'";
			}

			mdl.read(
				url,
				null, null, true,
				function(oData, oResponse) {
					if(oData.results.length>0){
						tempODATAPreCheck = oData.results;
						for (var q = 0; q < tempODATAPreCheck.length; q++) {
							var majorBlk = tempODATAPreCheck[q].UPGRADE_ELEMENT.split("_");
							var lastItem = majorBlk[majorBlk.length-1];
							if(lastItem.length!=32){
								
								if(me.getView().byId("ddlProd").getSelectedKey()=="All"){
							
								
									tempODATAPreCheckFilter.push(tempODATAPreCheck[q]);
								}  else if(me.getView().byId("ddlProd").getSelectedKey()=="RM"){
			
									for(var a2=0;a2<datatempoModelUpgradeRecruitREC.length;a2++){
										
										if(tempODATAPreCheck[q].UPGRADE_ELEMENT.indexOf("_")==-1){
											
										
											if(tempODATAPreCheck[q].UPGRADE_ELEMENT==datatempoModelUpgradeRecruitREC[a2].UPGRADE_ELEMENT){
													// if(datatempoModelUpgradeRecruitREC[a2].PRODUCT=="Recruiting"){
														tempODATAPreCheckFilter.push(tempODATAPreCheck[q]);
														break;	
													// }
												}
											
										}else{
											var majorBlk = tempODATAPreCheck[q].UPGRADE_ELEMENT.split("_");
											var lastItem = majorBlk[majorBlk.length-1];
											if(lastItem.length==32){
												majorBlk.pop();
												var CompmajorBlk = majorBlk.join("_");
												if(CompmajorBlk==datatempoModelUpgradeRecruitREC[a2].UPGRADE_ELEMENT){
													// if(datatempoModelUpgradeRecruitREC[a2].PRODUCT=="Recruiting"){
														tempODATAPreCheckFilter.push(tempODATAPreCheck[q]);
														break;	
													// }
												}
											}else{
												majorBlk.pop();
												majorBlk.pop();
												var CompmajorBlk = majorBlk.join("_");
												if(CompmajorBlk==datatempoModelUpgradeRecruitREC[a2].UPGRADE_ELEMENT){
													// if(datatempoModelUpgradeRecruitREC[a2].PRODUCT=="Recruiting"){
														tempODATAPreCheckFilter.push(tempODATAPreCheck[q]);
														break;	
													// }
												}
											}
										}
										
										
										
										
										
									}
								}  else if(me.getView().byId("ddlProd").getSelectedKey()=="SM"){
									for(var a2=0;a2<datatempoModelUpgradeRecruitSM.length;a2++){
										
			// 							
										
										
											if(tempODATAPreCheck[q].UPGRADE_ELEMENT.indexOf("_")==-1){
												
										
											if(tempODATAPreCheck[q].UPGRADE_ELEMENT==datatempoModelUpgradeRecruitSM[a2].UPGRADE_ELEMENT){
													// if(oModelUpgradeRecruitData[a2].PRODUCT=="Succession Management"){
														tempODATAPreCheckFilter.push(tempODATAPreCheck[q]);
														break;	
													// }
												}
											
										}else{
											var majorBlk = tempODATAPreCheck[q].UPGRADE_ELEMENT.split("_");
											var lastItem = majorBlk[majorBlk.length-1];
											if(lastItem.length==32){
												majorBlk.pop();
												var CompmajorBlk = majorBlk.join("_");
												if(CompmajorBlk==datatempoModelUpgradeRecruitSM[a2].UPGRADE_ELEMENT){
													// if(oModelUpgradeRecruitData[a2].PRODUCT=="Succession Management"){
														tempODATAPreCheckFilter.push(tempODATAPreCheck[q]);
														break;	
													// }
												}
											}else{
												majorBlk.pop();
												majorBlk.pop();
												var CompmajorBlk = majorBlk.join("_");
												if(CompmajorBlk==datatempoModelUpgradeRecruitSM[a2].UPGRADE_ELEMENT){
													// if(oModelUpgradeRecruitData[a2].PRODUCT=="Succession Management"){
														tempODATAPreCheckFilter.push(tempODATAPreCheck[q]);
														break;	
													// }
												}
											}
										}
										
										
										
										
									}
								}  else if(me.getView().byId("ddlProd").getSelectedKey()=="PG"){
									for(var a2=0;a2<datatempoModelUpgradeRecruitPG.length;a2++){
										
										
									
										
										
										if(tempODATAPreCheck[q].UPGRADE_ELEMENT.indexOf("_")==-1){
										
												if(tempODATAPreCheck[q].UPGRADE_ELEMENT==datatempoModelUpgradeRecruitPG[a2].UPGRADE_ELEMENT){
													// if(oModelUpgradeRecruitData[a2].PRODUCT=="Performance and Goals"){
														tempODATAPreCheckFilter.push(tempODATAPreCheck[q]);
														break;	
													// }
												}
											
										}else{
											var majorBlk = tempODATAPreCheck[q].UPGRADE_ELEMENT.split("_");
											var lastItem = majorBlk[majorBlk.length-1];
											if(lastItem.length==32){
												majorBlk.pop();
												var CompmajorBlk = majorBlk.join("_");
												if(CompmajorBlk==datatempoModelUpgradeRecruitPG[a2].UPGRADE_ELEMENT){
													// if(oModelUpgradeRecruitData[a2].PRODUCT=="Performance and Goals"){
														tempODATAPreCheckFilter.push(tempODATAPreCheck[q]);
														break;	
													// }
												}
											}else{
												majorBlk.pop();
												majorBlk.pop();
												var CompmajorBlk = majorBlk.join("_");
												if(CompmajorBlk==datatempoModelUpgradeRecruitPG[a2].UPGRADE_ELEMENT){
													// if(oModelUpgradeRecruitData[a2].PRODUCT=="Performance and Goals"){
														tempODATAPreCheckFilter.push(tempODATAPreCheck[q]);
														break;	
													// }
												}
											}
										}
										
										
										
										
									}
								}  else if(me.getView().byId("ddlProd").getSelectedKey()=="CO"){
									for(var a2=0;a2<datatempoModelUpgradeRecruitCO.length;a2++){
										
									
			
										if(tempODATAPreCheck[q].UPGRADE_ELEMENT.indexOf("_")==-1){
											
										if(tempODATAPreCheck[q].UPGRADE_ELEMENT==datatempoModelUpgradeRecruitCO[a2].UPGRADE_ELEMENT){
											// if(oModelUpgradeRecruitData[a2].PRODUCT=="Compensation"){
												tempODATAPreCheckFilter.push(tempODATAPreCheck[q]);
												break;
											
											// }
											}
										
										}else{
											var majorBlk = tempODATAPreCheck[q].UPGRADE_ELEMENT.split("_");
											var lastItem = majorBlk[majorBlk.length-1];
											if(lastItem.length==32){
												majorBlk.pop();
												var CompmajorBlk = majorBlk.join("_");
												if(CompmajorBlk==datatempoModelUpgradeRecruitCO[a2].UPGRADE_ELEMENT){
													// if(oModelUpgradeRecruitData[a2].PRODUCT=="Compensation"){
														tempODATAPreCheckFilter.push(tempODATAPreCheck[q]);
														break;	
													// }
												}
											}else{
												majorBlk.pop();
												majorBlk.pop();
												var CompmajorBlk = majorBlk.join("_");
												if(CompmajorBlk==datatempoModelUpgradeRecruitCO[a2].UPGRADE_ELEMENT){
													// if(oModelUpgradeRecruitData[a2].PRODUCT=="Compensation"){
														tempODATAPreCheckFilter.push(tempODATAPreCheck[q]);
														break;	
													// }
												}
											}
										}
										
										
										
										
									}
								}  else if(me.getView().byId("ddlProd").getSelectedKey()=="ON"){
									for(var a2=0;a2<datatempoModelUpgradeRecruitON.length;a2++){
										
									
										
			
										if(tempODATAPreCheck[q].UPGRADE_ELEMENT.indexOf("_")==-1){
											
											if(tempODATAPreCheck[q].UPGRADE_ELEMENT==datatempoModelUpgradeRecruitON[a2].UPGRADE_ELEMENT){
											// if(oModelUpgradeRecruitData[a2].PRODUCT=="Onboarding" || oModelUpgradeRecruitData[a2].PRODUCT=="Onboarding 2.0"){
												tempODATAPreCheckFilter.push(tempODATAPreCheck[q]);
												break;
											// }
										}
										
											
										}else{
											var majorBlk = tempODATAPreCheck[q].UPGRADE_ELEMENT.split("_");
											var lastItem = majorBlk[majorBlk.length-1];
											if(lastItem.length==32){
												majorBlk.pop();
												var CompmajorBlk = majorBlk.join("_");
												if(CompmajorBlk==datatempoModelUpgradeRecruitON[a2].UPGRADE_ELEMENT){
													// if(oModelUpgradeRecruitData[a2].PRODUCT=="Onboarding" || oModelUpgradeRecruitData[a2].PRODUCT=="Onboarding 2.0"){
														tempODATAPreCheckFilter.push(tempODATAPreCheck[q]);
														break;	
													// }
												}
											}else{
												majorBlk.pop();
												majorBlk.pop();
												var CompmajorBlk = majorBlk.join("_");
												if(CompmajorBlk==datatempoModelUpgradeRecruitON[a2].UPGRADE_ELEMENT){
													// if(oModelUpgradeRecruitData[a2].PRODUCT=="Onboarding" || oModelUpgradeRecruitData[a2].PRODUCT=="Onboarding 2.0"){
														tempODATAPreCheckFilter.push(tempODATAPreCheck[q]);
														break;	
													// }
												}
											}
										}
										
										
										
									}
								}  else if(me.getView().byId("ddlProd").getSelectedKey()=="EC"){
									for(var a2=0; a2<datatempoModelUpgradeRecruitEC.length; a2++){
										
									// var datatempoModelUpgradeRecruitON = sap.ui.getCore().getModel("oModelUpgradeRecruitON").getData();
			// var datatempoModelUpgradeRecruitREC = sap.ui.getCore().getModel("oModelUpgradeRecruitREC").getData();
			// var datatempoModelUpgradeRecruitSM = sap.ui.getCore().getModel("oModelUpgradeRecruitSM").getData();
			// var datatempoModelUpgradeRecruitPG = sap.ui.getCore().getModel("oModelUpgradeRecruitPG").getData();
			// var datatempoModelUpgradeRecruitCO = sap.ui.getCore().getModel("oModelUpgradeRecruitCO").getData();
			// var datatempoModelUpgradeRecruitEC = sap.ui.getCore().getModel("oModelUpgradeRecruitEC").getData();
										
										
										if(tempODATAPreCheck[q].UPGRADE_ELEMENT.indexOf("_")==-1){
											
										
												if(tempODATAPreCheck[q].UPGRADE_ELEMENT==datatempoModelUpgradeRecruitEC[a2].UPGRADE_ELEMENT){
													// if(oModelUpgradeRecruitData[a2].PRODUCT=="Employee Central"){
														tempODATAPreCheckFilter.push(tempODATAPreCheck[q]);
														break;	
													// }
												}
											
										 
											
										}else{
											var majorBlk = tempODATAPreCheck[q].UPGRADE_ELEMENT.split("_");
											var lastItem = majorBlk[majorBlk.length-1];
											if(lastItem.length==32){
												majorBlk.pop();
												var CompmajorBlk = majorBlk.join("_");
												if(CompmajorBlk==datatempoModelUpgradeRecruitEC[a2].UPGRADE_ELEMENT){
													// if(datatempoModelUpgradeRecruitEC[a2].PRODUCT=="Employee Central"){
														tempODATAPreCheckFilter.push(tempODATAPreCheck[q]);
														break;	
													// }
												}
											}else{
												majorBlk.pop();
												majorBlk.pop();
												var CompmajorBlk = majorBlk.join("_");
												if(CompmajorBlk==datatempoModelUpgradeRecruitEC[a2].UPGRADE_ELEMENT){
													// if(oModelUpgradeRecruitData[a2].PRODUCT=="Employee Central"){
														tempODATAPreCheckFilter.push(tempODATAPreCheck[q]);
														break;	
													// }
												}
											}
										}
									}
								}
							}
						
						}
						if (tempODATAPreCheckFilter.length > 0) {
						for (var w = 0; w < tempODATAPreCheckFilter.length; w++) {
							// if(tempODATAPreCheckFilter[w].COMPANY=="CRUZ ROJA ESPAÑOLA"){
							// 	tempODATAPreCheckFilter[w].COMPANY="CRUZ ROJA ESPAÑOLA DESARROLLO";
							// }
							// if(tempODATAPreCheckFilter[w].COMPANY=="Release"){
							// 	tempODATAPreCheckFilter[w].COMPANY="Stericycle Inc (de)";
							// }
							if(tempODATAPreCheckFilter[w].COMPANY!="BPMCINSTANCE4" && tempODATAPreCheckFilter[w].COMPANY!="BPMCINSTANCE1"){
								if (tempODATAPreCheckFilter[w].COMPANYSCHEMA != null && tempODATAPreCheckFilter[w].COMPANYSCHEMA.toLowerCase().indexOf("sfsales")==-1) {
								// if (tempODATAPreCheckFilter[w].COMPANYSCHEMA.toLowerCase().indexOf("sfv4") > -1 || tempODATAPreCheckFilter[w].COMPANYSCHEMA.toLowerCase().indexOf("hanapm") > -1 || tempODATAPreCheckFilter[w].COMPANYSCHEMA.toLowerCase().indexOf(
								// 		"stg") > -1 || tempODATAPreCheckFilter[w].COMPANYSCHEMA.toLowerCase().indexOf("stockpm172200_ref2") > -1  || tempODATAPreCheckFilter[w].COMPANYSCHEMA.toLowerCase().indexOf("dc") > -1) {
									tempDateRef.push({
										comp: tempODATAPreCheckFilter[w].COMPANY + GetDDMMYY(new Date(tempODATAPreCheckFilter[w].TIME_STAMP.toUTCString())),
										cmpny: tempODATAPreCheckFilter[w].COMPANY,
										time: GetMMDD(new Date(tempODATAPreCheckFilter[w].TIME_STAMP.toUTCString())),
										timeYY: GetMMDDYYYY(new Date(tempODATAPreCheckFilter[w].TIME_STAMP.toUTCString()))
									});
								// }
							}
							}

						}

						// var tempDatetempDateRef = tempDateRef.reduce(function(item, e1) {
						// 	var matchesRef = item.filter(function(e2) {
						// 		if (e1.cmpny == e2.cmpny && e1.time == e2.time) {
						// 			return e1.cmpny == e2.cmpny;
						// 		}
						// 	});
						// 	if (matchesRef.length == 0) {
						// 		item.push(e1);
						// 	}
						// 	return item;
						// }, []);

						// var uniqueArrayRef = tempDatetempDateRef;

						// var outputRef = [];
						
						// uniqueArrayRef.forEach(function(value) {
						// 	var existing = outputRef.filter(function(v, i) {
						// 		return v.time == value.time;
						// 	});

						// 	if (existing.length) {
						// 		var existingIndex = outputRef.indexOf(existing[0]);
						// 		outputRef[existingIndex].cmpny = outputRef[existingIndex].cmpny.concat(value.cmpny);
						// 	} else {
						// 		if (typeof value.cmpny == 'string') {
						// 			value.cmpny = [value.cmpny];
						// 		}
						// 		outputRef.push(value);
						// 	}
						// });
						
						// outputRef.sort(function(a, b) {
						// 	return (new Date(a.time) > new Date(b.time)) ? 1 : ((new Date(b.time) > new Date(a.time)) ? -1 : 0);
						// });
						// var inputFeedArry = [];
						// for (var j = 0; j< outputRef.length; j++) {
						// 	inputFeedArry.push({
						// 		time: outputRef[j].time,
						// 		cmpny: outputRef[j].cmpny.length,
						// 	});
						// }

						// var timeInput = [];
						// var cmpnyInput = [];

						// for (var t = 0; t < inputFeedArry.length; t++) {
						// 	timeInput.push(inputFeedArry[t].time);
						// 	cmpnyInput.push(inputFeedArry[t].cmpny);
						// }
						
						var tempDatetempDateRef = tempDateRef.reduce(function(item, e1) {
							var matchesRef = item.filter(function(e2) {
								if (e1.cmpny == e2.cmpny && e1.timeYY == e2.timeYY) {
									return e1.cmpny == e2.cmpny;
								}
							});
							if (matchesRef.length == 0) {
								item.push(e1);
							}
							return item;
						}, []);

						var uniqueArrayRef = tempDatetempDateRef;

						var outputRef = [];
						
						uniqueArrayRef.forEach(function(value) {
							var existing = outputRef.filter(function(v, i) {
								return v.timeYY == value.timeYY;
							});

							if (existing.length) {
								var existingIndex = outputRef.indexOf(existing[0]);
								outputRef[existingIndex].cmpny = outputRef[existingIndex].cmpny.concat(value.cmpny);
							} else {
								if (typeof value.cmpny == 'string') {
									value.cmpny = [value.cmpny];
								}
								outputRef.push(value);
							}
						});
						
						outputRef.sort(function(a, b) {
							return (new Date(a.timeYY) > new Date(b.timeYY)) ? 1 : ((new Date(b.timeYY) > new Date(a.timeYY)) ? -1 : 0);
						});
						var inputFeedArry = [];
						for (var j = 0; j< outputRef.length; j++) {
							inputFeedArry.push({
								timeYY: outputRef[j].timeYY,
								cmpny: outputRef[j].cmpny.length,
							});
						}

						var timeInput = [];
						var cmpnyInput = [];

						for (var t = 0; t < inputFeedArry.length; t++) {
							timeInput.push(inputFeedArry[t].timeYY);
							cmpnyInput.push(inputFeedArry[t].cmpny);
						}
						
						
						Highcharts.SVGRenderer.prototype.symbols.download = function(x, y, w, h) {
							var path = [
								// Arrow stem
								'M', x + w * 0.5, y,
								'L', x + w * 0.5, y + h * 0.7,
								// Arrow head
								'M', x + w * 0.3, y + h * 0.5,
								'L', x + w * 0.5, y + h * 0.7,
								'L', x + w * 0.7, y + h * 0.5,
								// Box
								'M', x, y + h * 0.9,
								'L', x, y + h,
								'L', x + w, y + h,
								'L', x + w, y + h * 0.9
							];
							return path;
						};

						var chartArea = Highcharts.chart('repoContainerReviewAreaDay', {
							chart: {
								type: 'areaspline',
								height: '180',
								plotBackgroundColor: "transparent",
								plotBorderWidth: null,
								plotShadow: false
							},
							colors:["#83bdf7"],
							title: {
								text: ''
							},
							legend: {
								margin: 2,
								itemStyle: {
									color: '#ddd',
									textOverflow:'ellipsis'
								},
								// align: 'right',
						  //      verticalAlign: 'top',
						  //      layout: 'vertical',
						  //      x: 15,
						  //      y: 25,
						  //      itemWidth: 50
								// itemDistance: 50
							},
							xAxis: {
								labels: {
									style: {
										color: '#ddd',
										fontSize: '10px'
									},
									
								},
								categories: timeInput,
								tickColor: 'transparent'
							},
							yAxis: {
								title: {
									text: ''
								},
								labels: {
									style: {
										color: '#ddd'
									}
								},
								gridLineColor: 'transparent'
							},
							tooltip: {
								shared: true,
								valueSuffix: ''
							},
							credits: {
								enabled: false
							},
							plotOptions: {
								areaspline: {
								      fillOpacity: 0.5
								  },
								series: {
									// fillColor: {
									// 	linearGradient: [0, 0, 0, 300],
									// 	stops: [
									// 		[0, '#f0ab00'],
									// 		[1, Highcharts.Color("#D2E6F8").setOpacity(0).get('rgba')]
									// 	]
									// },
									dataLabels: {
										align: 'center',
										enabled: true,
										color: '#ddd'
									},
									allowPointSelect: true,
									marker: {
						                states: {
						                    select: {
						                        fillColor: '#63e5e4',
						                    }
						                }
						            },
									point: {
				                        events: {
				                            click: function(e) {
			                            		if (this.selected == false || this.selected == undefined) {
			                            			
					        //                     	var chart = $("#repoContainerReviewArea").highcharts();
													// var selectedPoints = chart.getSelectedPoints();
													// if(selectedPoints.length>0){
													// 	selectedPoints[0].select();	
													// }
													
													// // var chart2 = $("#repoContainerReview").highcharts();
													// // var selectedPoints2 = chart2.getSelectedPoints();
													// // if(selectedPoints2.length>0){
													// // 	selectedPoints2[0].select();	
													// // }
											        
					        // //                     	me.getView().byId("HBarChart").vizSelection([], {
													// // 	"clearSelection": true
													// // });
													// var aFilters = [];
													// var tempCat = this.category.split("-").reverse();
													// var _tempC = tempCat[0]+"-"+tempCat[1];
													// var _tempCFull = tempCat[0]+"-"+tempCat[1]+"-"+tempCat[2];
					        //                     	var oModelAreaSplineRefData = sap.ui.getCore().getModel("oModelAreaSplineRef").getData();
					        //                     	for(var q=0;q<oModelAreaSplineRefData.length;q++){
					        //                     		if(oModelAreaSplineRefData[q].timeComp==_tempC){
					        //                     			// if(this.options.y==oModelAreaSplineRefData[q].cmpny.length){
				         //                   					for (var j = 0; j < oModelAreaSplineRefData[q].cmpny.length; j++) {
													// 				var filter = new sap.ui.model.Filter("time", sap.ui.model.FilterOperator.Contains, (_tempCFull).replace(/-/g, ' '));
													// 				aFilters.push(filter);
													// 			}
	
													// 			// update list binding
													// 			var list = me.getView().byId("listTable");
													// 			var binding = list.getBinding("items");
													// 			binding.filter(aFilters, "Application");
													// 			me.getView().byId("filterLabel").setText(this.category+" Customers");
					        //   //                 			}else{
					        //   //                 				var aFilters = [];
	
													// 			// // update list binding
													// 			// var list = me.getView().byId("listTable");
													// 			// var binding = list.getBinding("items");
													// 			// binding.filter(aFilters, "Application");
													// 			// me.getView().byId("filterLabel").setText("All Customers");
					        //   //                 			}
					        //                     		}
					        //                     	}
			                            		
			                            			
			                            		}else{
			                            			var aFilters = [];

													// update list binding
													var list = me.getView().byId("listTable");
													var binding = list.getBinding("items");
													binding.filter(aFilters, "Application");
													me.getView().byId("filterLabel").setText("All Customers");
			                            		}
						        			}
					                    }
			                        }
								},
							},
							series: [{
								name: 'All Customers',
								data: cmpnyInput
							}],
							navigation: {
								buttonOptions: {
									verticalAlign: 'top',
									x: 5,
									y: -12
								},
								menuStyle: {
									background: '#555'
								},
								menuItemStyle: {
									color: '#ddd'
								}
							},
							exporting: {
								chartOptions: {
									chart: {
										backgroundColor: '#555'
									}
								},
								buttons: {
									contextButton: {
										symbol: 'download',
										symbolFill: '#555'
									}
								},
								filename: 'Daily Breakdown Chart'
							}

						});

					}
					}else{
						
					}
				},
				function(oError) {
					console.log("Error 127");
				});

		
		},
		
		// loadChartBottom: function(mdl, para, fromCompDate,toCompDate) {
		// 	var tempBP = [];
		// 	var tempBPCountArray = [];
		// 	var oDataCHST = {};
		// 	var tempdataSP = [];
		// 	var totalCount = null;
		// 	var me = this;
		// 	var oModelColumnChartSVAccDetail = new sap.ui.model.json.JSONModel();
		// 	sap.ui.getCore().setModel(oModelColumnChartSVAccDetail, "oModelColumnChartSVAccDetail");

		// 	var oModelGroups = new sap.ui.model.json.JSONModel();
		// 	sap.ui.getCore().setModel(oModelGroups, "oModelGroups");
		// 	tempdataSP.push({
		// 		BP: "All Upgrade Elements",
		// 		BPKEY: "All"
		// 	});

		// 	if (para != "") {
		// 		var url =
		// 			"/UpgradeCenterResult?$select=UPGRADE_ELEMENT,COMPANYSCHEMA,COMPANY&$filter=(substringof('sfv4',COMPANYSCHEMA) or substringof('SFV4',COMPANYSCHEMA) or substringof('stockpm',COMPANYSCHEMA) or substringof('GLOBUSER_DVLHCM20S',COMPANYSCHEMA) or substringof('globuser_dvlhcm20s',COMPANYSCHEMA) or substringof('stockpm',COMPANYSCHEMA) or substringof('GLOBUSER_DVLHCM20S',COMPANYSCHEMA) or substringof('globuser_dvlhcm20s',COMPANYSCHEMA) or substringof('STOCKPM000110_REF2',COMPANYSCHEMA) or substringof('stockpm000110_ref2',COMPANYSCHEMA) or substringof('STOCKPM172200_REF2',COMPANYSCHEMA) or substringof('stockpm172200_ref2',COMPANYSCHEMA) or substringof('STOCKPM170737_REF',COMPANYSCHEMA) or substringof('stockpm170737_ref',COMPANYSCHEMA)    or substringof('DC',COMPANYSCHEMA) or substringof('dc',COMPANYSCHEMA) or substringof('STG',COMPANYSCHEMA) or substringof('stg',COMPANYSCHEMA) or substringof('HANAPM',COMPANYSCHEMA) or substringof('hanapm',COMPANYSCHEMA)) and COMPANYID ne 'PAYNGPPRL' and COMPANYID ne 'USBASEIAS22V1' and COMPANYID ne 'SAPSDCHXM0001' and COMPANYID ne 'PAYNGPPRLE' and COMPANYSCHEMA ne '' and COMPANY ne '' and COMPANY ne 'SAP SF Cloud Engineering' and FILEVERSION eq '" +
		// 			para + "' and TIME_STAMP ge datetime'"+fromCompDate+"' and TIME_STAMP le datetime'"+toCompDate+"'";
		// 	} else {
		// 		var url = "/UpgradeCenterResult?$select=UPGRADE_ELEMENT,COMPANYSCHEMA,COMPANY&$filter=(substringof('sfv4',COMPANYSCHEMA) or substringof('SFV4',COMPANYSCHEMA) or substringof('stockpm',COMPANYSCHEMA) or substringof('GLOBUSER_DVLHCM20S',COMPANYSCHEMA) or substringof('globuser_dvlhcm20s',COMPANYSCHEMA) or substringof('stockpm',COMPANYSCHEMA) or substringof('GLOBUSER_DVLHCM20S',COMPANYSCHEMA) or substringof('globuser_dvlhcm20s',COMPANYSCHEMA) or substringof('STOCKPM000110_REF2',COMPANYSCHEMA) or substringof('stockpm000110_ref2',COMPANYSCHEMA) or substringof('STOCKPM172200_REF2',COMPANYSCHEMA) or substringof('stockpm172200_ref2',COMPANYSCHEMA) or substringof('STOCKPM170737_REF',COMPANYSCHEMA) or substringof('stockpm170737_ref',COMPANYSCHEMA)    or substringof('DC',COMPANYSCHEMA) or substringof('dc',COMPANYSCHEMA) or substringof('STG',COMPANYSCHEMA) or substringof('stg',COMPANYSCHEMA) or substringof('HANAPM',COMPANYSCHEMA) or substringof('hanapm',COMPANYSCHEMA)) and COMPANYID ne 'PAYNGPPRL' and COMPANYID ne 'USBASEIAS22V1' and COMPANYID ne 'SAPSDCHXM0001' and COMPANYID ne 'PAYNGPPRLE' and COMPANYSCHEMA ne '' and COMPANY ne '' and COMPANY ne 'SAP SF Cloud Engineering' and TIME_STAMP ge datetime'"+fromCompDate+"' and TIME_STAMP le datetime'"+toCompDate+"'";
		// 	}

		// 	mdl.read(url,
		// 		null, null, true,
		// 		function(oData, oResponse) {
		// 			if (oData.results.length > 0) {
		// 				for (var w = 0; w < oData.results.length; w++) {

		// 					if (oData.results[w].COMPANYSCHEMA.toLowerCase().indexOf("bizx") === -1) {
		// 						if (oData.results[w].COMPANY.toLowerCase().indexOf("test") === -1 && oData.results[w].COMPANY.toLowerCase().indexOf("demo") ===
		// 							-1) {
		// 							tempBP.push(oData.results[w].UPGRADE_ELEMENT);
		// 						}
		// 					}

		// 				}
		// 				var uniqueBP = tempBP.filter(function(itm, i, tempBP) {
		// 					return i == tempBP.indexOf(itm);
		// 				});

		// 				for (var z = 0; z < uniqueBP.length; z++) {
		// 					if (uniqueBP[z].split("Best Practice Configurations Employee Central")[1] == undefined) {
		// 						if(uniqueBP[z].split("bestpracticesEmployeeCentral")[1] == undefined){
		// 							tempdataSP.push({
		// 								BP: "EC "+uniqueBP[z].split("Best Practices Employee Central")[1],
		// 								BPKEY: uniqueBP[z]
		// 							});
		// 						}else{
		// 							tempdataSP.push({
		// 								BP: "EC "+uniqueBP[z].split("bestpracticesEmployeeCentral")[1],
		// 								BPKEY: uniqueBP[z]
		// 							});
		// 						}
		// 					} else {
		// 						tempdataSP.push({
		// 							BP: "EC "+uniqueBP[z].split("Best Practice Configurations Employee Central")[1],
		// 							BPKEY: uniqueBP[z]
		// 						});
		// 					}

		// 					// tempdataSP.push({
		// 					// 	BP: uniqueBP[z]
		// 					// });
		// 					var oModelGroups = sap.ui.getCore().getModel("oModelGroups");
		// 					oModelGroups.setProperty('/splist', tempdataSP);

		// 					if (para != "") {
		// 						var subUrl =
		// 							"/UpgradeCenterResult?$select=COMPANYSCHEMA,COMPANY&$filter=(substringof('sfv4',COMPANYSCHEMA) or substringof('SFV4',COMPANYSCHEMA) or substringof('stockpm',COMPANYSCHEMA) or substringof('GLOBUSER_DVLHCM20S',COMPANYSCHEMA) or substringof('globuser_dvlhcm20s',COMPANYSCHEMA) or substringof('stockpm',COMPANYSCHEMA) or substringof('GLOBUSER_DVLHCM20S',COMPANYSCHEMA) or substringof('globuser_dvlhcm20s',COMPANYSCHEMA) or substringof('STOCKPM000110_REF2',COMPANYSCHEMA) or substringof('stockpm000110_ref2',COMPANYSCHEMA) or substringof('STOCKPM172200_REF2',COMPANYSCHEMA) or substringof('stockpm172200_ref2',COMPANYSCHEMA) or substringof('STOCKPM170737_REF',COMPANYSCHEMA) or substringof('stockpm170737_ref',COMPANYSCHEMA)    or substringof('DC',COMPANYSCHEMA) or substringof('dc',COMPANYSCHEMA) or substringof('STG',COMPANYSCHEMA) or substringof('stg',COMPANYSCHEMA) or substringof('HANAPM',COMPANYSCHEMA) or substringof('hanapm',COMPANYSCHEMA)) and COMPANYID ne 'PAYNGPPRL' and COMPANYID ne 'USBASEIAS22V1' and COMPANYID ne 'SAPSDCHXM0001' and COMPANYID ne 'PAYNGPPRLE' and COMPANYSCHEMA ne '' and COMPANY ne '' and COMPANY ne 'SAP SF Cloud Engineering' and UPGRADE_ELEMENT eq '" +
		// 							uniqueBP[z] + "' and FILEVERSION eq '" + para + "' and TIME_STAMP ge datetime'"+fromCompDate+"' and TIME_STAMP le datetime'"+toCompDate+"'";
		// 					} else {
		// 						var subUrl =
		// 							"/UpgradeCenterResult?$select=COMPANYSCHEMA,COMPANY&$filter=(substringof('sfv4',COMPANYSCHEMA) or substringof('SFV4',COMPANYSCHEMA) or substringof('stockpm',COMPANYSCHEMA) or substringof('GLOBUSER_DVLHCM20S',COMPANYSCHEMA) or substringof('globuser_dvlhcm20s',COMPANYSCHEMA) or substringof('stockpm',COMPANYSCHEMA) or substringof('GLOBUSER_DVLHCM20S',COMPANYSCHEMA) or substringof('globuser_dvlhcm20s',COMPANYSCHEMA) or substringof('STOCKPM000110_REF2',COMPANYSCHEMA) or substringof('stockpm000110_ref2',COMPANYSCHEMA) or substringof('STOCKPM172200_REF2',COMPANYSCHEMA) or substringof('stockpm172200_ref2',COMPANYSCHEMA) or substringof('STOCKPM170737_REF',COMPANYSCHEMA) or substringof('stockpm170737_ref',COMPANYSCHEMA)    or substringof('DC',COMPANYSCHEMA) or substringof('dc',COMPANYSCHEMA) or substringof('STG',COMPANYSCHEMA) or substringof('stg',COMPANYSCHEMA) or substringof('HANAPM',COMPANYSCHEMA) or substringof('hanapm',COMPANYSCHEMA)) and COMPANYID ne 'PAYNGPPRL' and COMPANYID ne 'USBASEIAS22V1' and COMPANYID ne 'SAPSDCHXM0001' and COMPANYID ne 'PAYNGPPRLE' and COMPANYSCHEMA ne '' and COMPANY ne '' and COMPANY ne 'SAP SF Cloud Engineering' and UPGRADE_ELEMENT eq '" +
		// 							uniqueBP[z] + "' and TIME_STAMP ge datetime'"+fromCompDate+"' and TIME_STAMP le datetime'"+toCompDate+"'";
		// 					}

		// 					mdl.read(
		// 						subUrl,
		// 						null, null, true,
		// 						function(oData, oResponse) {
		// 							var tempCmpny = [];
		// 							if (oData.results.length > 0) {
		// 								for (var w = 0; w < oData.results.length; w++) {

		// 									if (oData.results[w].COMPANYSCHEMA.toLowerCase().indexOf("bizx") === -1) {
		// 										if (oData.results[w].COMPANY.toLowerCase().indexOf("test") === -1 && oData.results[w].COMPANY.toLowerCase().indexOf(
		// 												"demo") ===
		// 											-1) {
		// 											tempCmpny.push(oData.results[w].COMPANY);
		// 										}
		// 									}

		// 									// if (oData.results[w].COMPANY != '') {
		// 									// 	tempCmpny.push(oData.results[w].COMPANY);
		// 									// }

		// 								}
		// 								var uniqueCmpny = tempCmpny.filter(function(itm, i, tempCmpny) {
		// 									return i == tempCmpny.indexOf(itm);
		// 								});

		// 								if (oResponse.requestUri.split("eq")[1].split("'")[1].split("Best Practice Configurations Employee Central")[1] == undefined) {
		// 									if(oResponse.requestUri.split("eq")[1].split("'")[1].split("bestpracticesEmployeeCentral")[1] == undefined){
		// 										tempBPCountArray.push({
		// 											element: "EC "+oResponse.requestUri.split("eq")[1].split("'")[1].split("Best Practices Employee Central")[1],
		// 											count: uniqueCmpny.length
		// 										});
		// 									}else{
		// 										tempBPCountArray.push({
		// 											element: "EC "+oResponse.requestUri.split("eq")[1].split("'")[1].split("bestpracticesEmployeeCentral")[1],
		// 											count: uniqueCmpny.length
		// 										});
		// 									}
		// 								} else {
		// 									tempBPCountArray.push({
		// 										element: "EC "+oResponse.requestUri.split("eq")[1].split("'")[1].split("Best Practice Configurations Employee Central")[1],
		// 										count: uniqueCmpny.length
		// 									});
		// 								}

		// 								totalCount += uniqueCmpny.length;
		// 								var oModelColumnChartSVAccDetail = sap.ui.getCore().getModel("oModelColumnChartSVAccDetail");
		// 								oModelColumnChartSVAccDetail.setProperty('/data', tempBPCountArray);

		// 								var oVizFrame = me.getView().byId("HBarChart");
		// 								oVizFrame.setVizProperties({
		// 									plotArea: {
		// 										dataLabel: {
		// 											visible: true,
		// 											//formatString: CustomerFormat.FIORI_LABEL_SHORTFORMAT_2,
		// 											type: "short",
		// 											style: {
		// 												color: "#fff"
		// 											},
		// 										},
		// 										gap: {
		// 											barSpacing: 0.3,
		// 											groupSpacing: 0.3

		// 										},
		// 										dataPointSize: {
		// 											min: 20,
		// 											max: 30
		// 										},
		// 										drawingEffect: 'glossy',
		// 										colorPalette: ['#427CAC', '#dddddd'],
		// 										gridline: {
		// 											visible: false
		// 										}
		// 									},
		// 									general: {
		// 										background: {
		// 											color: "#555"
		// 										},
		// 									},
		// 									categoryAxis: {
		// 										title: {
		// 											visible: false
		// 										},
		// 										label: {
		// 											style: {
		// 												color: "#ddd"
		// 											}
		// 										},
		// 										hoverShadow: {
		// 											color: "#000"
		// 										},
		// 										mouseDownShadow: {
		// 											color: "#7b7878"
		// 										}
		// 									},
		// 									valueAxis: {
		// 										label: {
		// 											style: {
		// 												color: "#ddd"
		// 											}
		// 										},
		// 										title: {
		// 											visible: false
		// 										}
		// 									},
		// 									legend:{
		// 										drawingEffect:'glossy',
		// 										label: {
		// 											style: {
		// 												color: "#ddd"
		// 											}
		// 										},
		// 										hoverShadow: {
		// 											color: "#000"
		// 										},
		// 										mouseDownShadow: {
		// 											color: "#7b7878"
		// 										}
		// 									}

		// 								});

		// 							}
		// 						},
		// 						function(oError) {
		// 							console.log("Error 127");
		// 						});
		// 				}

		// 				var oDataGrp = {
		// 					"splist": tempdataSP
		// 				};

		// 				oModelGroups.setData(oDataGrp);
		// 				me.getView().byId("ddlSP").setModel(oModelGroups);
		// 				me.getView().byId("ddlSP").setSelectedKeys("All");
		// 				oDataCHST = {
		// 					data: tempBPCountArray
		// 				};

		// 				var oModelColumnChartSVAccDetail = sap.ui.getCore().getModel("oModelColumnChartSVAccDetail");
		// 				oModelColumnChartSVAccDetail.setData(oDataCHST);

		// 				var oVizFrame = me.getView().byId("HBarChart");

		// 				oVizFrame.destroyFeeds();

		// 				var oDataset = new sap.viz.ui5.data.FlattenedDataset({
		// 					dimensions: [{
		// 						name: "Element",
		// 						value: "{element}"

		// 					}],
		// 					measures: [{
		// 						name: "Count",
		// 						value: "{count}"
		// 					}],

		// 					data: {
		// 						path: "/data"
		// 					}
		// 				});

		// 				oVizFrame.setDataset(oDataset);
		// 				oVizFrame.setModel(oModelColumnChartSVAccDetail);

		// 				// var oPopOver = me.getView().byId("idPopOver");
		// 				//         oPopOver.connect(oVizFrame.getVizUid());

		// 				var feedValueAxis = new sap.viz.ui5.controls.common.feeds.FeedItem({
		// 					'uid': "valueAxis",
		// 					'type': "Measure",
		// 					'values': ["Count"]
		// 				});
		// 				var feedCategoryAxis = new sap.viz.ui5.controls.common.feeds.FeedItem({
		// 					'uid': "categoryAxis",
		// 					'type': "Dimension",
		// 					'values': ["Element"]
		// 				});
		// 				oVizFrame.addFeed(feedValueAxis);
		// 				//oVizFrame.addFeed(feedValueAxis2);
		// 				oVizFrame.addFeed(feedCategoryAxis);

		// 				oVizFrame.setVizProperties({
		// 					plotArea: {
		// 						dataLabel: {
		// 							visible: true,
		// 							//formatString: CustomerFormat.FIORI_LABEL_SHORTFORMAT_2,
		// 							type: "short",
		// 							style: {
		// 								color: "#fff"
		// 							}
		// 						},
		// 						gap: {
		// 							barSpacing: 0.3,
		// 							groupSpacing: 0.3

		// 						},
		// 						dataPointSize: {
		// 							min: 20,
		// 							max: 30
		// 						},
		// 						drawingEffect: 'glossy',
		// 						colorPalette: ['#427CAC', '#dddddd'],
		// 						gridline: {
		// 							visible: false
		// 						}
		// 					},
		// 					general: {
		// 						background: {
		// 							color: "#555"
		// 						},
		// 					},
		// 					categoryAxis: {
		// 						title: {
		// 							visible: false
		// 						},
		// 						label: {
		// 							style: {
		// 								color: "#ddd"
		// 							}
		// 						},
		// 						hoverShadow: {
		// 							color: "#000"
		// 						},
		// 						mouseDownShadow: {
		// 							color: "#7b7878"
		// 						}
		// 					},
		// 					valueAxis: {
		// 						label: {
		// 							style: {
		// 								color: "#ddd"
		// 							}
		// 						},
		// 						title: {
		// 							visible: false
		// 						}
		// 					},
		// 					legend:{
		// 						drawingEffect:'glossy',
		// 						label: {
		// 							style: {
		// 								color: "#ddd"
		// 							}
		// 						},
		// 						hoverShadow: {
		// 							color: "#000"
		// 						},
		// 						mouseDownShadow: {
		// 							color: "#7b7878"
		// 						}
		// 					}

		// 				});

		// 			}
		// 		},
		// 		function(oError) {
		// 			console.log("Error 127");
		// 		});

		// },
		loadLineChartBottom: function(mdl, para, fromCompDate, toCompDate) {
			// var refFromDate = GetDDMM(new Date(fromCompDate.split("T")[0])); 
			// var refToDate = GetDDMM(new Date(toCompDate.split("T")[0]));
			
			// var Datetoday = new Date();
			// var fromDate = new Date();
			// fromDate.setMonth((fromDate.getMonth() - 24));
			// fromDate.setDate(fromDate.getDate() + 1);
			
			// if(fromDate.getDate()!=1){
			// 	fromDate.setDate(1);
			// }
			
			// // fromDate = fromDate.YYYYMMDD();

			// var fromCompDateRef = fromDate.toISOString();
			// var toCompDateTemp = Datetoday.toISOString();
			
			// fromCompDateRef = fromCompDateRef.split("T")[0] + "T24:00";
			// toCompDateTemp = toCompDateTemp.split("T")[0] + "T24:00";
			// var tempDateTo = (new Date(toCompDateTemp)).getDate() + 1;
			// var d = new Date(toCompDateTemp);
			// d.setDate(tempDateTo);
			// var toCompDateRef = d.toISOString();
			// toCompDateRef = toCompDateRef.split("T")[0] + "T24:00";
				
			
			var greenfield = [];
			var brownfield = [];
			var greenFeedArry = [];
			var brownFeedArry = [];

			var tempDate = [];
			var oDataCHSTLine = {};
			var inputFeedArry = [];
			var preInputAry = [];
			var oModelLineChartSVAccDetailBtm = new sap.ui.model.json.JSONModel();
			sap.ui.getCore().setModel(oModelLineChartSVAccDetailBtm, "oModelLineChartSVAccDetailBtm");
			var me = this;
			
			var tempODATAPreCheck = [];
			var tempODATAPreCheckFilter = [];
			// var oModelUpgradeRecruitData = sap.ui.getCore().getModel("oModelUpgradeRecruit").getData();
			
			var datatempoModelUpgradeRecruitON = sap.ui.getCore().getModel("oModelUpgradeRecruitON").getData();
			var datatempoModelUpgradeRecruitREC = sap.ui.getCore().getModel("oModelUpgradeRecruitREC").getData();
			var datatempoModelUpgradeRecruitSM = sap.ui.getCore().getModel("oModelUpgradeRecruitSM").getData();
			var datatempoModelUpgradeRecruitPG = sap.ui.getCore().getModel("oModelUpgradeRecruitPG").getData();
			var datatempoModelUpgradeRecruitCO = sap.ui.getCore().getModel("oModelUpgradeRecruitCO").getData();
			var datatempoModelUpgradeRecruitEC = sap.ui.getCore().getModel("oModelUpgradeRecruitEC").getData();
			
			var deployKey = me.getView().byId("ddlDeploy").getSelectedKey();
			

			if (para != "") {
				if(deployKey=="All"){
				var url =
					"/UpgradeCenterResult?$select=UPGRADE_ELEMENT,COMPANY,RESULT,COMPANYSCHEMA,TIME_STAMP&$orderby=TIME_STAMP asc&$filter=(substringof('sfv4',COMPANYSCHEMA) or substringof('SFV4',COMPANYSCHEMA) or substringof('STOCKPM',COMPANYSCHEMA) or substringof('GLOBUSER_DVLHCM20S',COMPANYSCHEMA) or substringof('globuser_dvlhcm20s',COMPANYSCHEMA) or substringof('stockpm',COMPANYSCHEMA) or substringof('GLOBUSER_DVLHCM20S',COMPANYSCHEMA) or substringof('globuser_dvlhcm20s',COMPANYSCHEMA) or substringof('STOCKPM000110_REF2',COMPANYSCHEMA) or substringof('stockpm000110_ref2',COMPANYSCHEMA) or substringof('STOCKPM172200_REF2',COMPANYSCHEMA) or substringof('stockpm172200_ref2',COMPANYSCHEMA) or substringof('STOCKPM170737_REF',COMPANYSCHEMA) or substringof('stockpm170737_ref',COMPANYSCHEMA)    or substringof('DC',COMPANYSCHEMA) or substringof('dc',COMPANYSCHEMA) or substringof('STG',COMPANYSCHEMA) or substringof('stg',COMPANYSCHEMA) or substringof('HANAPM',COMPANYSCHEMA) or substringof('hanapm',COMPANYSCHEMA)) and COMPANYID ne 'PAYNGPPRL' and COMPANYID ne 'USBASEIAS22V1' and COMPANYID ne 'SAPSDCHXM0001' and COMPANYID ne 'PAYNGPPRLE' and COMPANYSCHEMA ne '' and COMPANY ne '' and COMPANY ne 'SAP SF Cloud Engineering' and FILEVERSION eq '" +
					para + "' and TIME_STAMP ge datetime'" + fromCompDate + "' and TIME_STAMP le datetime'" + toCompDate + "'";
				}else if(deployKey=="CUST"){
					var url =
					"/UpgradeCenterResult?$select=UPGRADE_ELEMENT,COMPANY,RESULT,COMPANYSCHEMA,TIME_STAMP&$orderby=TIME_STAMP asc&$filter=(substringof('sfv4',COMPANYSCHEMA) or substringof('SFV4',COMPANYSCHEMA) or substringof('STOCKPM',COMPANYSCHEMA) or substringof('GLOBUSER_DVLHCM20S',COMPANYSCHEMA) or substringof('globuser_dvlhcm20s',COMPANYSCHEMA) or substringof('stockpm',COMPANYSCHEMA) or substringof('GLOBUSER_DVLHCM20S',COMPANYSCHEMA) or substringof('globuser_dvlhcm20s',COMPANYSCHEMA) or substringof('STOCKPM000110_REF2',COMPANYSCHEMA) or substringof('stockpm000110_ref2',COMPANYSCHEMA) or substringof('STOCKPM172200_REF2',COMPANYSCHEMA) or substringof('stockpm172200_ref2',COMPANYSCHEMA) or substringof('STOCKPM170737_REF',COMPANYSCHEMA) or substringof('stockpm170737_ref',COMPANYSCHEMA)    or substringof('DC',COMPANYSCHEMA) or substringof('dc',COMPANYSCHEMA) or substringof('STG',COMPANYSCHEMA) or substringof('stg',COMPANYSCHEMA) or substringof('HANAPM',COMPANYSCHEMA) or substringof('hanapm',COMPANYSCHEMA)) and substringof('_',UPGRADE_ELEMENT) and COMPANYID ne 'PAYNGPPRL' and COMPANYID ne 'USBASEIAS22V1' and COMPANYID ne 'SAPSDCHXM0001' and COMPANYID ne 'PAYNGPPRLE' and COMPANYSCHEMA ne '' and COMPANY ne '' and COMPANY ne 'SAP SF Cloud Engineering' and FILEVERSION eq '" +
					para + "' and TIME_STAMP ge datetime'" + fromCompDate + "' and TIME_STAMP le datetime'" + toCompDate + "'";
				}else{
				var url =
					"/UpgradeCenterResult?$select=UPGRADE_ELEMENT,COMPANY,RESULT,COMPANYSCHEMA,TIME_STAMP&$orderby=TIME_STAMP asc&$filter=(substringof('sfv4',COMPANYSCHEMA) or substringof('SFV4',COMPANYSCHEMA) or substringof('STOCKPM',COMPANYSCHEMA) or substringof('GLOBUSER_DVLHCM20S',COMPANYSCHEMA) or substringof('globuser_dvlhcm20s',COMPANYSCHEMA) or substringof('stockpm',COMPANYSCHEMA) or substringof('GLOBUSER_DVLHCM20S',COMPANYSCHEMA) or substringof('globuser_dvlhcm20s',COMPANYSCHEMA) or substringof('STOCKPM000110_REF2',COMPANYSCHEMA) or substringof('stockpm000110_ref2',COMPANYSCHEMA) or substringof('STOCKPM172200_REF2',COMPANYSCHEMA) or substringof('stockpm172200_ref2',COMPANYSCHEMA) or substringof('STOCKPM170737_REF',COMPANYSCHEMA) or substringof('stockpm170737_ref',COMPANYSCHEMA)    or substringof('DC',COMPANYSCHEMA) or substringof('dc',COMPANYSCHEMA) or substringof('STG',COMPANYSCHEMA) or substringof('stg',COMPANYSCHEMA) or substringof('HANAPM',COMPANYSCHEMA) or substringof('hanapm',COMPANYSCHEMA)) and indexof(UPGRADE_ELEMENT,'_') eq -1  and COMPANYID ne 'PAYNGPPRL' and COMPANYID ne 'USBASEIAS22V1' and COMPANYID ne 'SAPSDCHXM0001' and COMPANYID ne 'PAYNGPPRLE' and COMPANYSCHEMA ne '' and COMPANY ne '' and COMPANY ne 'SAP SF Cloud Engineering' and FILEVERSION eq '" +
					para + "' and TIME_STAMP ge datetime'" + fromCompDate + "' and TIME_STAMP le datetime'" + toCompDate + "'";	
				}
				// var url =
				// 	"/UpgradeCenterResult?$select=UPGRADE_ELEMENT,COMPANY,RESULT,COMPANYSCHEMA,TIME_STAMP&$orderby=TIME_STAMP asc&$filter=(substringof('sfv4',COMPANYSCHEMA) or substringof('SFV4',COMPANYSCHEMA) or substringof('stockpm',COMPANYSCHEMA) or substringof('GLOBUSER_DVLHCM20S',COMPANYSCHEMA) or substringof('globuser_dvlhcm20s',COMPANYSCHEMA) or substringof('stockpm',COMPANYSCHEMA) or substringof('GLOBUSER_DVLHCM20S',COMPANYSCHEMA) or substringof('globuser_dvlhcm20s',COMPANYSCHEMA) or substringof('STOCKPM000110_REF2',COMPANYSCHEMA) or substringof('stockpm000110_ref2',COMPANYSCHEMA) or substringof('STOCKPM172200_REF2',COMPANYSCHEMA) or substringof('stockpm172200_ref2',COMPANYSCHEMA) or substringof('STOCKPM170737_REF',COMPANYSCHEMA) or substringof('stockpm170737_ref',COMPANYSCHEMA)    or substringof('DC',COMPANYSCHEMA) or substringof('dc',COMPANYSCHEMA) or substringof('STG',COMPANYSCHEMA) or substringof('stg',COMPANYSCHEMA) or substringof('HANAPM',COMPANYSCHEMA) or substringof('hanapm',COMPANYSCHEMA)) and COMPANYID ne 'PAYNGPPRL' and COMPANYID ne 'USBASEIAS22V1' and COMPANYID ne 'SAPSDCHXM0001' and COMPANYID ne 'PAYNGPPRLE' and COMPANYSCHEMA ne '' and COMPANY ne '' and COMPANY ne 'SAP SF Cloud Engineering' and FILEVERSION eq '" +
				// 	para + "' and TIME_STAMP ge datetime'" + fromCompDate + "' and TIME_STAMP le datetime'" + toCompDate + "'";
			} else {
				if(deployKey=="All"){
				var url =
					"/UpgradeCenterResult?$select=UPGRADE_ELEMENT,COMPANY,RESULT,COMPANYSCHEMA,TIME_STAMP&$orderby=TIME_STAMP asc&$filter=(substringof('sfv4',COMPANYSCHEMA) or substringof('SFV4',COMPANYSCHEMA) or substringof('STOCKPM',COMPANYSCHEMA) or substringof('GLOBUSER_DVLHCM20S',COMPANYSCHEMA) or substringof('globuser_dvlhcm20s',COMPANYSCHEMA) or substringof('stockpm',COMPANYSCHEMA) or substringof('GLOBUSER_DVLHCM20S',COMPANYSCHEMA) or substringof('globuser_dvlhcm20s',COMPANYSCHEMA) or substringof('STOCKPM000110_REF2',COMPANYSCHEMA) or substringof('stockpm000110_ref2',COMPANYSCHEMA) or substringof('STOCKPM172200_REF2',COMPANYSCHEMA) or substringof('stockpm172200_ref2',COMPANYSCHEMA) or substringof('STOCKPM170737_REF',COMPANYSCHEMA) or substringof('stockpm170737_ref',COMPANYSCHEMA)    or substringof('DC',COMPANYSCHEMA) or substringof('dc',COMPANYSCHEMA) or substringof('STG',COMPANYSCHEMA) or substringof('stg',COMPANYSCHEMA) or substringof('HANAPM',COMPANYSCHEMA) or substringof('hanapm',COMPANYSCHEMA)) and COMPANYID ne 'PAYNGPPRL' and COMPANYID ne 'USBASEIAS22V1' and COMPANYID ne 'SAPSDCHXM0001' and COMPANYID ne 'PAYNGPPRLE' and COMPANYSCHEMA ne '' and COMPANY ne '' and COMPANY ne 'SAP SF Cloud Engineering' and TIME_STAMP ge datetime'" +
					fromCompDate + "' and TIME_STAMP le datetime'" + toCompDate + "'";
				}else if(deployKey=="CUST"){
					var url =
					"/UpgradeCenterResult?$select=UPGRADE_ELEMENT,COMPANY,RESULT,COMPANYSCHEMA,TIME_STAMP&$orderby=TIME_STAMP asc&$filter=(substringof('sfv4',COMPANYSCHEMA) or substringof('SFV4',COMPANYSCHEMA) or substringof('STOCKPM',COMPANYSCHEMA) or substringof('GLOBUSER_DVLHCM20S',COMPANYSCHEMA) or substringof('globuser_dvlhcm20s',COMPANYSCHEMA) or substringof('stockpm',COMPANYSCHEMA) or substringof('GLOBUSER_DVLHCM20S',COMPANYSCHEMA) or substringof('globuser_dvlhcm20s',COMPANYSCHEMA) or substringof('STOCKPM000110_REF2',COMPANYSCHEMA) or substringof('stockpm000110_ref2',COMPANYSCHEMA) or substringof('STOCKPM172200_REF2',COMPANYSCHEMA) or substringof('stockpm172200_ref2',COMPANYSCHEMA) or substringof('STOCKPM170737_REF',COMPANYSCHEMA) or substringof('stockpm170737_ref',COMPANYSCHEMA)    or substringof('DC',COMPANYSCHEMA) or substringof('dc',COMPANYSCHEMA) or substringof('STG',COMPANYSCHEMA) or substringof('stg',COMPANYSCHEMA) or substringof('HANAPM',COMPANYSCHEMA) or substringof('hanapm',COMPANYSCHEMA)) and substringof('_',UPGRADE_ELEMENT) and COMPANYID ne 'PAYNGPPRL' and COMPANYID ne 'USBASEIAS22V1' and COMPANYID ne 'SAPSDCHXM0001' and COMPANYID ne 'PAYNGPPRLE' and COMPANYSCHEMA ne '' and COMPANY ne '' and COMPANY ne 'SAP SF Cloud Engineering' and TIME_STAMP ge datetime'" +
					fromCompDate + "' and TIME_STAMP le datetime'" + toCompDate + "'";
				}else{
					var url =
					"/UpgradeCenterResult?$select=UPGRADE_ELEMENT,COMPANY,RESULT,COMPANYSCHEMA,TIME_STAMP&$orderby=TIME_STAMP asc&$filter=(substringof('sfv4',COMPANYSCHEMA) or substringof('SFV4',COMPANYSCHEMA) or substringof('STOCKPM',COMPANYSCHEMA) or substringof('GLOBUSER_DVLHCM20S',COMPANYSCHEMA) or substringof('globuser_dvlhcm20s',COMPANYSCHEMA) or substringof('stockpm',COMPANYSCHEMA) or substringof('GLOBUSER_DVLHCM20S',COMPANYSCHEMA) or substringof('globuser_dvlhcm20s',COMPANYSCHEMA) or substringof('STOCKPM000110_REF2',COMPANYSCHEMA) or substringof('stockpm000110_ref2',COMPANYSCHEMA) or substringof('STOCKPM172200_REF2',COMPANYSCHEMA) or substringof('stockpm172200_ref2',COMPANYSCHEMA) or substringof('STOCKPM170737_REF',COMPANYSCHEMA) or substringof('stockpm170737_ref',COMPANYSCHEMA)    or substringof('DC',COMPANYSCHEMA) or substringof('dc',COMPANYSCHEMA) or substringof('STG',COMPANYSCHEMA) or substringof('stg',COMPANYSCHEMA) or substringof('HANAPM',COMPANYSCHEMA) or substringof('hanapm',COMPANYSCHEMA)) and indexof(UPGRADE_ELEMENT,'_') eq -1  and COMPANYID ne 'PAYNGPPRL' and COMPANYID ne 'USBASEIAS22V1' and COMPANYID ne 'SAPSDCHXM0001' and COMPANYID ne 'PAYNGPPRLE' and COMPANYSCHEMA ne '' and COMPANY ne '' and COMPANY ne 'SAP SF Cloud Engineering' and TIME_STAMP ge datetime'" +
					fromCompDate + "' and TIME_STAMP le datetime'" + toCompDate + "'";
				}
				// var url =
				// 	"/UpgradeCenterResult?$select=UPGRADE_ELEMENT,COMPANY,RESULT,COMPANYSCHEMA,TIME_STAMP&$orderby=TIME_STAMP asc&$filter=(substringof('sfv4',COMPANYSCHEMA) or substringof('SFV4',COMPANYSCHEMA) or substringof('stockpm',COMPANYSCHEMA) or substringof('GLOBUSER_DVLHCM20S',COMPANYSCHEMA) or substringof('globuser_dvlhcm20s',COMPANYSCHEMA) or substringof('stockpm',COMPANYSCHEMA) or substringof('GLOBUSER_DVLHCM20S',COMPANYSCHEMA) or substringof('globuser_dvlhcm20s',COMPANYSCHEMA) or substringof('STOCKPM000110_REF2',COMPANYSCHEMA) or substringof('stockpm000110_ref2',COMPANYSCHEMA) or substringof('STOCKPM172200_REF2',COMPANYSCHEMA) or substringof('stockpm172200_ref2',COMPANYSCHEMA) or substringof('STOCKPM170737_REF',COMPANYSCHEMA) or substringof('stockpm170737_ref',COMPANYSCHEMA)    or substringof('DC',COMPANYSCHEMA) or substringof('dc',COMPANYSCHEMA) or substringof('STG',COMPANYSCHEMA) or substringof('stg',COMPANYSCHEMA) or substringof('HANAPM',COMPANYSCHEMA) or substringof('hanapm',COMPANYSCHEMA)) and COMPANYID ne 'PAYNGPPRL' and COMPANYID ne 'USBASEIAS22V1' and COMPANYID ne 'SAPSDCHXM0001' and COMPANYID ne 'PAYNGPPRLE' and COMPANYSCHEMA ne '' and COMPANY ne '' and COMPANY ne 'SAP SF Cloud Engineering' and TIME_STAMP ge datetime'" +
				// 	fromCompDate + "' and TIME_STAMP le datetime'" + toCompDate + "'";
			}

			mdl.read(
				url,
				null, null, true,
				function(oData, oResponse) {
					if(oData.results.length>0){
						tempODATAPreCheck = oData.results;
						for (var q = 0; q < tempODATAPreCheck.length; q++) {
							var majorBlk = tempODATAPreCheck[q].UPGRADE_ELEMENT.split("_");
							var lastItem = majorBlk[majorBlk.length-1];
							if(lastItem.length!=32){
								
								if(me.getView().byId("ddlProd").getSelectedKey()=="All"){
							
								
									tempODATAPreCheckFilter.push(tempODATAPreCheck[q]);
								}  else if(me.getView().byId("ddlProd").getSelectedKey()=="RM"){
			
									for(var a2=0;a2<datatempoModelUpgradeRecruitREC.length;a2++){
										
										if(tempODATAPreCheck[q].UPGRADE_ELEMENT.indexOf("_")==-1){
											
										
											if(tempODATAPreCheck[q].UPGRADE_ELEMENT==datatempoModelUpgradeRecruitREC[a2].UPGRADE_ELEMENT){
													// if(datatempoModelUpgradeRecruitREC[a2].PRODUCT=="Recruiting"){
														tempODATAPreCheckFilter.push(tempODATAPreCheck[q]);
														break;	
													// }
												}
											
										}else{
											var majorBlk = tempODATAPreCheck[q].UPGRADE_ELEMENT.split("_");
											var lastItem = majorBlk[majorBlk.length-1];
											if(lastItem.length==32){
												majorBlk.pop();
												var CompmajorBlk = majorBlk.join("_");
												if(CompmajorBlk==datatempoModelUpgradeRecruitREC[a2].UPGRADE_ELEMENT){
													// if(datatempoModelUpgradeRecruitREC[a2].PRODUCT=="Recruiting"){
														tempODATAPreCheckFilter.push(tempODATAPreCheck[q]);
														break;	
													// }
												}
											}else{
												majorBlk.pop();
												majorBlk.pop();
												var CompmajorBlk = majorBlk.join("_");
												if(CompmajorBlk==datatempoModelUpgradeRecruitREC[a2].UPGRADE_ELEMENT){
													// if(datatempoModelUpgradeRecruitREC[a2].PRODUCT=="Recruiting"){
														tempODATAPreCheckFilter.push(tempODATAPreCheck[q]);
														break;	
													// }
												}
											}
										}
										
										
										
										
										
									}
								}  else if(me.getView().byId("ddlProd").getSelectedKey()=="SM"){
									for(var a2=0;a2<datatempoModelUpgradeRecruitSM.length;a2++){
										
			// 							
										
										
											if(tempODATAPreCheck[q].UPGRADE_ELEMENT.indexOf("_")==-1){
												
										
											if(tempODATAPreCheck[q].UPGRADE_ELEMENT==datatempoModelUpgradeRecruitSM[a2].UPGRADE_ELEMENT){
													// if(oModelUpgradeRecruitData[a2].PRODUCT=="Succession Management"){
														tempODATAPreCheckFilter.push(tempODATAPreCheck[q]);
														break;	
													// }
												}
											
										}else{
											var majorBlk = tempODATAPreCheck[q].UPGRADE_ELEMENT.split("_");
											var lastItem = majorBlk[majorBlk.length-1];
											if(lastItem.length==32){
												majorBlk.pop();
												var CompmajorBlk = majorBlk.join("_");
												if(CompmajorBlk==datatempoModelUpgradeRecruitSM[a2].UPGRADE_ELEMENT){
													// if(oModelUpgradeRecruitData[a2].PRODUCT=="Succession Management"){
														tempODATAPreCheckFilter.push(tempODATAPreCheck[q]);
														break;	
													// }
												}
											}else{
												majorBlk.pop();
												majorBlk.pop();
												var CompmajorBlk = majorBlk.join("_");
												if(CompmajorBlk==datatempoModelUpgradeRecruitSM[a2].UPGRADE_ELEMENT){
													// if(oModelUpgradeRecruitData[a2].PRODUCT=="Succession Management"){
														tempODATAPreCheckFilter.push(tempODATAPreCheck[q]);
														break;	
													// }
												}
											}
										}
										
										
										
										
									}
								}  else if(me.getView().byId("ddlProd").getSelectedKey()=="PG"){
									for(var a2=0;a2<datatempoModelUpgradeRecruitPG.length;a2++){
										
										
									
										
										
										if(tempODATAPreCheck[q].UPGRADE_ELEMENT.indexOf("_")==-1){
										
												if(tempODATAPreCheck[q].UPGRADE_ELEMENT==datatempoModelUpgradeRecruitPG[a2].UPGRADE_ELEMENT){
													// if(oModelUpgradeRecruitData[a2].PRODUCT=="Performance and Goals"){
														tempODATAPreCheckFilter.push(tempODATAPreCheck[q]);
														break;	
													// }
												}
											
										}else{
											var majorBlk = tempODATAPreCheck[q].UPGRADE_ELEMENT.split("_");
											var lastItem = majorBlk[majorBlk.length-1];
											if(lastItem.length==32){
												majorBlk.pop();
												var CompmajorBlk = majorBlk.join("_");
												if(CompmajorBlk==datatempoModelUpgradeRecruitPG[a2].UPGRADE_ELEMENT){
													// if(oModelUpgradeRecruitData[a2].PRODUCT=="Performance and Goals"){
														tempODATAPreCheckFilter.push(tempODATAPreCheck[q]);
														break;	
													// }
												}
											}else{
												majorBlk.pop();
												majorBlk.pop();
												var CompmajorBlk = majorBlk.join("_");
												if(CompmajorBlk==datatempoModelUpgradeRecruitPG[a2].UPGRADE_ELEMENT){
													// if(oModelUpgradeRecruitData[a2].PRODUCT=="Performance and Goals"){
														tempODATAPreCheckFilter.push(tempODATAPreCheck[q]);
														break;	
													// }
												}
											}
										}
										
										
										
										
									}
								}  else if(me.getView().byId("ddlProd").getSelectedKey()=="CO"){
									for(var a2=0;a2<datatempoModelUpgradeRecruitCO.length;a2++){
										
									
			
										if(tempODATAPreCheck[q].UPGRADE_ELEMENT.indexOf("_")==-1){
											
										if(tempODATAPreCheck[q].UPGRADE_ELEMENT==datatempoModelUpgradeRecruitCO[a2].UPGRADE_ELEMENT){
											// if(oModelUpgradeRecruitData[a2].PRODUCT=="Compensation"){
												tempODATAPreCheckFilter.push(tempODATAPreCheck[q]);
												break;
											
											// }
											}
										
										}else{
											var majorBlk = tempODATAPreCheck[q].UPGRADE_ELEMENT.split("_");
											var lastItem = majorBlk[majorBlk.length-1];
											if(lastItem.length==32){
												majorBlk.pop();
												var CompmajorBlk = majorBlk.join("_");
												if(CompmajorBlk==datatempoModelUpgradeRecruitCO[a2].UPGRADE_ELEMENT){
													// if(oModelUpgradeRecruitData[a2].PRODUCT=="Compensation"){
														tempODATAPreCheckFilter.push(tempODATAPreCheck[q]);
														break;	
													// }
												}
											}else{
												majorBlk.pop();
												majorBlk.pop();
												var CompmajorBlk = majorBlk.join("_");
												if(CompmajorBlk==datatempoModelUpgradeRecruitCO[a2].UPGRADE_ELEMENT){
													// if(oModelUpgradeRecruitData[a2].PRODUCT=="Compensation"){
														tempODATAPreCheckFilter.push(tempODATAPreCheck[q]);
														break;	
													// }
												}
											}
										}
										
										
										
										
									}
								}  else if(me.getView().byId("ddlProd").getSelectedKey()=="ON"){
									for(var a2=0;a2<datatempoModelUpgradeRecruitON.length;a2++){
										
									
										
			
										if(tempODATAPreCheck[q].UPGRADE_ELEMENT.indexOf("_")==-1){
											
											if(tempODATAPreCheck[q].UPGRADE_ELEMENT==datatempoModelUpgradeRecruitON[a2].UPGRADE_ELEMENT){
											// if(oModelUpgradeRecruitData[a2].PRODUCT=="Onboarding" || oModelUpgradeRecruitData[a2].PRODUCT=="Onboarding 2.0"){
												tempODATAPreCheckFilter.push(tempODATAPreCheck[q]);
												break;
											// }
										}
										
											
										}else{
											var majorBlk = tempODATAPreCheck[q].UPGRADE_ELEMENT.split("_");
											var lastItem = majorBlk[majorBlk.length-1];
											if(lastItem.length==32){
												majorBlk.pop();
												var CompmajorBlk = majorBlk.join("_");
												if(CompmajorBlk==datatempoModelUpgradeRecruitON[a2].UPGRADE_ELEMENT){
													// if(oModelUpgradeRecruitData[a2].PRODUCT=="Onboarding" || oModelUpgradeRecruitData[a2].PRODUCT=="Onboarding 2.0"){
														tempODATAPreCheckFilter.push(tempODATAPreCheck[q]);
														break;	
													// }
												}
											}else{
												majorBlk.pop();
												majorBlk.pop();
												var CompmajorBlk = majorBlk.join("_");
												if(CompmajorBlk==datatempoModelUpgradeRecruitON[a2].UPGRADE_ELEMENT){
													// if(oModelUpgradeRecruitData[a2].PRODUCT=="Onboarding" || oModelUpgradeRecruitData[a2].PRODUCT=="Onboarding 2.0"){
														tempODATAPreCheckFilter.push(tempODATAPreCheck[q]);
														break;	
													// }
												}
											}
										}
										
										
										
									}
								}  else if(me.getView().byId("ddlProd").getSelectedKey()=="EC"){
									for(var a2=0; a2<datatempoModelUpgradeRecruitEC.length; a2++){
										
									// var datatempoModelUpgradeRecruitON = sap.ui.getCore().getModel("oModelUpgradeRecruitON").getData();
			// var datatempoModelUpgradeRecruitREC = sap.ui.getCore().getModel("oModelUpgradeRecruitREC").getData();
			// var datatempoModelUpgradeRecruitSM = sap.ui.getCore().getModel("oModelUpgradeRecruitSM").getData();
			// var datatempoModelUpgradeRecruitPG = sap.ui.getCore().getModel("oModelUpgradeRecruitPG").getData();
			// var datatempoModelUpgradeRecruitCO = sap.ui.getCore().getModel("oModelUpgradeRecruitCO").getData();
			// var datatempoModelUpgradeRecruitEC = sap.ui.getCore().getModel("oModelUpgradeRecruitEC").getData();
										
										
										if(tempODATAPreCheck[q].UPGRADE_ELEMENT.indexOf("_")==-1){
											
										
												if(tempODATAPreCheck[q].UPGRADE_ELEMENT==datatempoModelUpgradeRecruitEC[a2].UPGRADE_ELEMENT){
													// if(oModelUpgradeRecruitData[a2].PRODUCT=="Employee Central"){
														tempODATAPreCheckFilter.push(tempODATAPreCheck[q]);
														break;	
													// }
												}
											
										 
											
										}else{
											var majorBlk = tempODATAPreCheck[q].UPGRADE_ELEMENT.split("_");
											var lastItem = majorBlk[majorBlk.length-1];
											if(lastItem.length==32){
												majorBlk.pop();
												var CompmajorBlk = majorBlk.join("_");
												if(CompmajorBlk==datatempoModelUpgradeRecruitEC[a2].UPGRADE_ELEMENT){
													// if(datatempoModelUpgradeRecruitEC[a2].PRODUCT=="Employee Central"){
														tempODATAPreCheckFilter.push(tempODATAPreCheck[q]);
														break;	
													// }
												}
											}else{
												majorBlk.pop();
												majorBlk.pop();
												var CompmajorBlk = majorBlk.join("_");
												if(CompmajorBlk==datatempoModelUpgradeRecruitEC[a2].UPGRADE_ELEMENT){
													// if(oModelUpgradeRecruitData[a2].PRODUCT=="Employee Central"){
														tempODATAPreCheckFilter.push(tempODATAPreCheck[q]);
														break;	
													// }
												}
											}
										}
									}
								}
							}
						}
						if (tempODATAPreCheckFilter.length > 0) {
						for (var w = 0; w < tempODATAPreCheckFilter.length; w++) {
							// if(tempODATAPreCheckFilter[w].COMPANY=="CRUZ ROJA ESPAÑOLA"){
							// 	tempODATAPreCheckFilter[w].COMPANY="CRUZ ROJA ESPAÑOLA DESARROLLO";
							// }
							// if(tempODATAPreCheckFilter[w].COMPANY=="Release"){
							// 	tempODATAPreCheckFilter[w].COMPANY="Stericycle Inc (de)";
							// }
							if(tempODATAPreCheckFilter[w].COMPANY!="BPMCINSTANCE4" && tempODATAPreCheckFilter[w].COMPANY!="BPMCINSTANCE1"){
								if (tempODATAPreCheckFilter[w].COMPANYSCHEMA != null && tempODATAPreCheckFilter[w].COMPANYSCHEMA.toLowerCase().indexOf("sfsales")==-1) {
								// if (tempODATAPreCheckFilter[w].COMPANYSCHEMA.toLowerCase().indexOf("sfv4") > -1 || tempODATAPreCheckFilter[w].COMPANYSCHEMA.toLowerCase().indexOf("stockpm172200_ref2") > -1 || tempODATAPreCheckFilter[w].COMPANYSCHEMA.toLowerCase().indexOf("hanapm") > -1 || tempODATAPreCheckFilter[w].COMPANYSCHEMA.toLowerCase().indexOf(
								// 		"stg") > -1 || tempODATAPreCheckFilter[w].COMPANYSCHEMA.toLowerCase().indexOf("dc") > -1) {
									tempDate.push({
										comp: tempODATAPreCheckFilter[w].COMPANY +"+"+ tempODATAPreCheckFilter[w].RESULT +"+"+ tempODATAPreCheckFilter[w].UPGRADE_ELEMENT +"+"+ GetDDMMYY(new Date(tempODATAPreCheckFilter[w].TIME_STAMP.toUTCString())),
										cmpny: tempODATAPreCheckFilter[w].COMPANY,
										time: GetDDMMYY(new Date(tempODATAPreCheckFilter[w].TIME_STAMP.toUTCString())),
										timeComp: GetDDMM(new Date(tempODATAPreCheckFilter[w].TIME_STAMP.toUTCString())),
										upgrade: tempODATAPreCheckFilter[w].UPGRADE_ELEMENT,
										result: tempODATAPreCheckFilter[w].RESULT,
										puretime: tempODATAPreCheckFilter[w].TIME_STAMP.toUTCString()
									});
								// }
							}
							}
						}

						var tempDatetempDate = tempDate.reduce(function(item, e1) {
							var matches = item.filter(function(e2) {
								return e1.comp == e2.comp;
							});
							if (matches.length == 0) {
								item.push(e1);
							}
							return item;
						}, []);

						// var uniqueArray = me.removeDuplicates(tempDatetempDate, "cmpny");

						var output = [];

						tempDatetempDate.forEach(function(value) {
							var existing = output.filter(function(v, i) {
								return v.timeComp == value.timeComp;
							});

							if (existing.length) {
								var existingIndex = output.indexOf(existing[0]);
								output[existingIndex].cmpny = output[existingIndex].cmpny.concat(value.cmpny);
								output[existingIndex].upgrade = output[existingIndex].upgrade.concat(value.upgrade);
								output[existingIndex].time = output[existingIndex].time.concat(value.time);
								output[existingIndex].result = output[existingIndex].result.concat(value.result);
								output[existingIndex].puretime = output[existingIndex].puretime.concat(value.puretime);
							} else {
								if (typeof value.cmpny == 'string') {
									value.cmpny = [value.cmpny];
								}
								if (typeof value.upgrade == 'string') {
									value.upgrade = [value.upgrade];
								}
								if (typeof value.time == 'string') {
									value.time = [value.time];
								}
								if (typeof value.result == 'string') {
									value.result = [value.result];
								}
								if (typeof value.puretime == 'string') {
									value.puretime = [value.puretime];
								}
								output.push(value);
							}
						});

						for (var q = 0; q < output.length; q++) {
							preInputAry.push({
								timeComp: output[q].timeComp,
								items: []
							});

							for (var w = 0; w < output[q].cmpny.length; w++) {
								preInputAry[q].items.push({
									cmpny: output[q].cmpny[w],
									upgrade: output[q].upgrade[w],
									time: output[q].time[w],
									result: output[q].result[w],
									puretime:output[q].puretime[w]
								});
							}
						}
						
						for (var q = 0; q < preInputAry.length; q++) {
							preInputAry[q].items.sort(function(a,b) {return (a.cmpny > b.cmpny) ? 1 : ((b.cmpny> a.cmpny) ? -1 : 0);} );
						}

						for (var q = 0; q < preInputAry.length; q++) {
							for (var w = 0; w < preInputAry[q].items.length; w++) {
								
								
								if (preInputAry[q].items[w].upgrade.indexOf("Core") > -1) {
									if(preInputAry[q].items[w].result.indexOf("true") > -1){
										greenfield.push({
											cmpny: preInputAry[q].items[w].cmpny,
											time: preInputAry[q].items[w].time,
											timeComp: preInputAry[q].timeComp,
											upgrade: preInputAry[q].items[w].upgrade,
											result:preInputAry[q].items[w].result,
											puretime:preInputAry[q].items[w].puretime
										});
									}else if(preInputAry[q].items[w].result.indexOf("false") > -1){
										
										if(preInputAry[q].items[w+1]!=undefined){
											
											if(preInputAry[q].items[w].cmpny==preInputAry[q].items[w+1].cmpny){
												if(preInputAry[q].items[w+1].result.indexOf("true") > -1){
													if (preInputAry[q].items[w].upgrade.indexOf("Core") > -1) {
														greenfield.push({
															cmpny: preInputAry[q].items[w].cmpny,
															time: preInputAry[q].items[w].time,
															timeComp: preInputAry[q].timeComp,
															upgrade: preInputAry[q].items[w].upgrade,
															result:preInputAry[q].items[w].result,
															puretime:preInputAry[q].items[w].puretime
														});
													}else{
														brownfield.push({
															cmpny: preInputAry[q].items[w].cmpny,
															time: preInputAry[q].items[w].time,
															timeComp: preInputAry[q].timeComp,
															upgrade: preInputAry[q].items[w].upgrade,
															result:preInputAry[q].items[w].result,
															puretime:preInputAry[q].items[w].puretime
														});
													}
													
												}else if(preInputAry[q].items[w+1].result.indexOf("false") > -1){
													greenfield.push({
														cmpny: preInputAry[q].items[w].cmpny,
														time: preInputAry[q].items[w].time,
														timeComp: preInputAry[q].timeComp,
														upgrade: preInputAry[q].items[w].upgrade,
														result:preInputAry[q].items[w].result,
														puretime:preInputAry[q].items[w].puretime
													});
												}
											}
											
										}
										
										greenfield.push({
											cmpny: preInputAry[q].items[w].cmpny,
											time: preInputAry[q].items[w].time,
											timeComp: preInputAry[q].timeComp,
											upgrade: preInputAry[q].items[w].upgrade,
											result:preInputAry[q].items[w].result,
											puretime:preInputAry[q].items[w].puretime
										});
										
									}
									// greenfield.push({
									// 	cmpny: preInputAry[q].items[w].cmpny,
									// 	time: preInputAry[q].items[w].time,
									// 	timeComp: preInputAry[q].timeComp,
									// 	upgrade: preInputAry[q].items[w].upgrade
									// });
									
								} else {
									brownfield.push({
										cmpny: preInputAry[q].items[w].cmpny,
										time: preInputAry[q].items[w].time,
										timeComp: preInputAry[q].timeComp,
										upgrade: preInputAry[q].items[w].upgrade,
										result:preInputAry[q].items[w].result,
										puretime:preInputAry[q].items[w].puretime
									});
								}
								
							}
						}

						// greenfield.sort(function(a,b) {
						// 	return ((a.cmpny > b.cmpny) ? 1 : ((b.cmpny> a.cmpny) ? -1 : 0)) || (a.time - b.time);
							
						// });
						greenfield.sort(function(a,b) {
							return (a.cmpny > b.cmpny) ? 1 : ((b.cmpny> a.cmpny) ? -1 : 0);
							
						});
						brownfield.sort(function(a,b) {return (a.cmpny > b.cmpny) ? 1 : ((b.cmpny> a.cmpny) ? -1 : 0);} );
						
						for (var q = 0; q < greenfield.length; q++) {
							if(greenfield[q+1]!=undefined){
								if(greenfield[q].cmpny == greenfield[q+1].cmpny){
									if((new Date(greenfield[q].time).getMonth()) != (new Date(greenfield[q+1].time).getMonth())){
										var timeDiff = Math.abs(new Date(greenfield[q].time).getTime() - new Date(greenfield[q+1].time).getTime());
										var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
										if (diffDays > 30) {
											// if (new Date(greenfield[q].time) < new Date(brownfield[z].time)) {
											// 	greenfield.splice(q, 1);
											// } else {
											// 	brownfield.splice(z, 1);
											// }
										} else {
											if ((new Date(greenfield[q].puretime)) < (new Date(greenfield[q+1].puretime))) {
												greenfield.splice(q+1, 1);
											} else {
												greenfield.splice(q, 1);
											}
										}
									}
								}
							}
							
						}
						
						for (var q = 0; q < greenfield.length; q++) {
							if(greenfield[q+1]!=undefined){
								if(greenfield[q].cmpny == greenfield[q+1].cmpny){
									if((new Date(greenfield[q].time).getMonth()) != (new Date(greenfield[q+1].time).getMonth())){
										var timeDiff = Math.abs(new Date(greenfield[q].time).getTime() - new Date(greenfield[q+1].time).getTime());
										var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
										if (diffDays > 30) {
											// if (new Date(greenfield[q].time) < new Date(brownfield[z].time)) {
											// 	greenfield.splice(q, 1);
											// } else {
											// 	brownfield.splice(z, 1);
											// }
										} else {
											if ((new Date(greenfield[q].puretime)) < (new Date(greenfield[q+1].puretime))) {
												greenfield.splice(q+1, 1);
											} else {
												greenfield.splice(q, 1);
											}
										}
									}
								}
							}
							
						}
						for (var q = 0; q < greenfield.length; q++) {
							if(greenfield[q+1]!=undefined){
								if(greenfield[q].cmpny == greenfield[q+1].cmpny){
									if((new Date(greenfield[q].time).getMonth()) != (new Date(greenfield[q+1].time).getMonth())){
										var timeDiff = Math.abs(new Date(greenfield[q].time).getTime() - new Date(greenfield[q+1].time).getTime());
										var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
										if (diffDays > 30) {
											// if (new Date(greenfield[q].time) < new Date(brownfield[z].time)) {
											// 	greenfield.splice(q, 1);
											// } else {
											// 	brownfield.splice(z, 1);
											// }
										} else {
											if ((new Date(greenfield[q].puretime)) < (new Date(greenfield[q+1].puretime))) {
												greenfield.splice(q+1, 1);
											} else {
												greenfield.splice(q, 1);
											}
										}
									}
								}
							}
							
						}
						for (var q = 0; q < greenfield.length; q++) {
							if(greenfield[q+1]!=undefined){
								if(greenfield[q].cmpny == greenfield[q+1].cmpny){
									if((new Date(greenfield[q].time).getMonth()) != (new Date(greenfield[q+1].time).getMonth())){
										var timeDiff = Math.abs(new Date(greenfield[q].time).getTime() - new Date(greenfield[q+1].time).getTime());
										var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
										if (diffDays > 30) {
											// if (new Date(greenfield[q].time) < new Date(brownfield[z].time)) {
											// 	greenfield.splice(q, 1);
											// } else {
											// 	brownfield.splice(z, 1);
											// }
										} else {
											if ((new Date(greenfield[q].puretime)) < (new Date(greenfield[q+1].puretime))) {
												greenfield.splice(q+1, 1);
											} else {
												greenfield.splice(q, 1);
											}
										}
									}
								}
							}
							
						}
						for (var q = 0; q < greenfield.length; q++) {
							if(greenfield[q+1]!=undefined){
								if(greenfield[q].cmpny == greenfield[q+1].cmpny){
									if((new Date(greenfield[q].time).getMonth()) != (new Date(greenfield[q+1].time).getMonth())){
										var timeDiff = Math.abs(new Date(greenfield[q].time).getTime() - new Date(greenfield[q+1].time).getTime());
										var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
										if (diffDays > 30) {
											// if (new Date(greenfield[q].time) < new Date(brownfield[z].time)) {
											// 	greenfield.splice(q, 1);
											// } else {
											// 	brownfield.splice(z, 1);
											// }
										} else {
											if ((new Date(greenfield[q].puretime)) < (new Date(greenfield[q+1].puretime))) {
												greenfield.splice(q+1, 1);
											} else {
												greenfield.splice(q, 1);
											}
										}
									}
								}
							}
							
						}
						for (var q = 0; q < greenfield.length; q++) {
							if(greenfield[q+1]!=undefined){
								if(greenfield[q].cmpny == greenfield[q+1].cmpny){
									if((new Date(greenfield[q].time).getMonth()) != (new Date(greenfield[q+1].time).getMonth())){
										var timeDiff = Math.abs(new Date(greenfield[q].time).getTime() - new Date(greenfield[q+1].time).getTime());
										var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
										if (diffDays > 30) {
											// if (new Date(greenfield[q].time) < new Date(brownfield[z].time)) {
											// 	greenfield.splice(q, 1);
											// } else {
											// 	brownfield.splice(z, 1);
											// }
										} else {
											if ((new Date(greenfield[q].puretime)) < (new Date(greenfield[q+1].puretime))) {
												greenfield.splice(q+1, 1);
											} else {
												greenfield.splice(q, 1);
											}
										}
									}
								}
							}
							
						}





						for (var q = 0; q < greenfield.length; q++) {
							for (var z = 0; z < brownfield.length; z++) {
								if (greenfield[q].cmpny == brownfield[z].cmpny) {
									
									// if (greenfield[q].timeComp == brownfield[z].timeComp) {
									// 	if ((greenfield[q].puretime) < (brownfield[z].puretime)) {
									// 		brownfield.splice(z, 1);
									// 	} else {
									// 		greenfield.splice(q, 1);
									// 	}
									// } else {
									// 	var timeDiff = Math.abs((greenfield[q].puretime).getTime() - (brownfield[z].puretime).getTime());
									// 	var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
									// 	if (diffDays > 30) {
									// 		// if (new Date(greenfield[q].time) < new Date(brownfield[z].time)) {
									// 		// 	greenfield.splice(q, 1);
									// 		// } else {
									// 		// 	brownfield.splice(z, 1);
									// 		// }
									// 	} else {
									// 		brownfield.splice(z, 1);
									// 	}
									// }
									
									
									
										if ((new Date(greenfield[q].puretime)) < (new Date(brownfield[z].puretime))) {
											var timeDiff = Math.abs((new Date(brownfield[z].puretime)).getTime() - (new Date(greenfield[q].puretime)).getTime());
											var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
											if (diffDays > 30) {
												
											}else{
												brownfield.splice(z, 1);
											}
											
										} else {
											var timeDiff = Math.abs((new Date(greenfield[q].puretime)).getTime() - (new Date(brownfield[z].puretime)).getTime());
											var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
											if (diffDays > 30) {
												// if (new Date(greenfield[q].time) < new Date(brownfield[z].time)) {
												// 	greenfield.splice(q, 1);
												// } else {
												// 	brownfield.splice(z, 1);
												// }
											} else {
												brownfield.splice(z, 1);
											}
											// greenfield.splice(q, 1);
										}
									
									
									
									
									
								} else {

								}
							}
						}
						
						for (var q = 0; q < greenfield.length; q++) {
							for (var z = 0; z < brownfield.length; z++) {
								if (greenfield[q].cmpny == brownfield[z].cmpny) {
										if ((new Date(greenfield[q].puretime)) < (new Date(brownfield[z].puretime))) {
											var timeDiff = Math.abs((new Date(brownfield[z].puretime)).getTime() - (new Date(greenfield[q].puretime)).getTime());
											var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
											if (diffDays > 30) {
												
											}else{
												brownfield.splice(z, 1);
											}
										} else {
											var timeDiff = Math.abs((new Date(greenfield[q].puretime)).getTime() - (new Date(brownfield[z].puretime)).getTime());
											var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
											if (diffDays > 30) {
											} else {
												brownfield.splice(z, 1);
											}
										}
									
								} else {

								}
							}
						}
						for (var q = 0; q < greenfield.length; q++) {
							for (var z = 0; z < brownfield.length; z++) {
								if (greenfield[q].cmpny == brownfield[z].cmpny) {
										if ((new Date(greenfield[q].puretime)) < (new Date(brownfield[z].puretime))) {
											var timeDiff = Math.abs((new Date(brownfield[z].puretime)).getTime() - (new Date(greenfield[q].puretime)).getTime());
											var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
											if (diffDays > 30) {
												
											}else{
												brownfield.splice(z, 1);
											}
										} else {
											var timeDiff = Math.abs((new Date(greenfield[q].puretime)).getTime() - (new Date(brownfield[z].puretime)).getTime());
											var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
											if (diffDays > 30) {
											} else {
												brownfield.splice(z, 1);
											}
										}
									
								} else {

								}
							}
						}
						for (var q = 0; q < greenfield.length; q++) {
							for (var z = 0; z < brownfield.length; z++) {
								if (greenfield[q].cmpny == brownfield[z].cmpny) {
										if ((new Date(greenfield[q].puretime)) < (new Date(brownfield[z].puretime))) {
											var timeDiff = Math.abs((new Date(brownfield[z].puretime)).getTime() - (new Date(greenfield[q].puretime)).getTime());
											var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
											if (diffDays > 30) {
												
											}else{
												brownfield.splice(z, 1);
											}
										} else {
											var timeDiff = Math.abs((new Date(greenfield[q].puretime)).getTime() - (new Date(brownfield[z].puretime)).getTime());
											var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
											if (diffDays > 30) {
											} else {
												brownfield.splice(z, 1);
											}
										}
									
								} else {

								}
							}
						}
						for (var q = 0; q < greenfield.length; q++) {
							for (var z = 0; z < brownfield.length; z++) {
								if (greenfield[q].cmpny == brownfield[z].cmpny) {
										if ((new Date(greenfield[q].puretime)) < (new Date(brownfield[z].puretime))) {
											var timeDiff = Math.abs((new Date(brownfield[z].puretime)).getTime() - (new Date(greenfield[q].puretime)).getTime());
											var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
											if (diffDays > 30) {
												
											}else{
												brownfield.splice(z, 1);
											}
										} else {
											var timeDiff = Math.abs((new Date(greenfield[q].puretime)).getTime() - (new Date(brownfield[z].puretime)).getTime());
											var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
											if (diffDays > 30) {
											} else {
												brownfield.splice(z, 1);
											}
										}
									
								} else {

								}
							}
						}
						for (var q = 0; q < greenfield.length; q++) {
							for (var z = 0; z < brownfield.length; z++) {
								if (greenfield[q].cmpny == brownfield[z].cmpny) {
										if ((new Date(greenfield[q].puretime)) < (new Date(brownfield[z].puretime))) {
											var timeDiff = Math.abs((new Date(brownfield[z].puretime)).getTime() - (new Date(greenfield[q].puretime)).getTime());
											var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
											if (diffDays > 30) {
												
											}else{
												brownfield.splice(z, 1);
											}
										} else {
											var timeDiff = Math.abs((new Date(greenfield[q].puretime)).getTime() - (new Date(brownfield[z].puretime)).getTime());
											var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
											if (diffDays > 30) {
											} else {
												brownfield.splice(z, 1);
											}
										}
									
								} else {

								}
							}
						}
						for (var q = 0; q < greenfield.length; q++) {
							for (var z = 0; z < brownfield.length; z++) {
								if (greenfield[q].cmpny == brownfield[z].cmpny) {
										if ((new Date(greenfield[q].puretime)) < (new Date(brownfield[z].puretime))) {
											var timeDiff = Math.abs((new Date(brownfield[z].puretime)).getTime() - (new Date(greenfield[q].puretime)).getTime());
											var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
											if (diffDays > 30) {
												
											}else{
												brownfield.splice(z, 1);
											}
										} else {
											var timeDiff = Math.abs((new Date(greenfield[q].puretime)).getTime() - (new Date(brownfield[z].puretime)).getTime());
											var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
											if (diffDays > 30) {
											} else {
												brownfield.splice(z, 1);
											}
										}
									
								} else {

								}
							}
						}

						// var tempDataGreen = greenfield.reduce(function(item, e1) {
						// 	var matches = item.filter(function(e2) {
						// 		return e1.comp == e2.comp;
						// 	});
						// 	if (matches.length == 0) {
						// 		item.push(e1);
						// 	}
						// 	return item;
						// }, []);

						var outputGreen = [];

						greenfield.forEach(function(value) {
							var existing = outputGreen.filter(function(v, i) {
								return v.timeComp == value.timeComp;
							});

							if (existing.length) {
								var existingIndex = outputGreen.indexOf(existing[0]);
								outputGreen[existingIndex].cmpny = outputGreen[existingIndex].cmpny.concat(value.cmpny);
								outputGreen[existingIndex].time = outputGreen[existingIndex].time.concat(value.time);
							} else {
								if (typeof value.cmpny == 'string') {
									value.cmpny = [value.cmpny];
								}
								if (typeof value.time == 'string') {
									value.time = [value.time];
								}
								outputGreen.push(value);
							}
						});

						var outputBrown = [];

						brownfield.forEach(function(value) {
							var existing = outputBrown.filter(function(v, i) {
								return v.timeComp == value.timeComp;
							});

							if (existing.length) {
								var existingIndex = outputBrown.indexOf(existing[0]);
								outputBrown[existingIndex].cmpny = outputBrown[existingIndex].cmpny.concat(value.cmpny);
								outputBrown[existingIndex].time = outputBrown[existingIndex].time.concat(value.time);
							} else {
								if (typeof value.cmpny == 'string') {
									value.cmpny = [value.cmpny];
								}
								if (typeof value.time == 'string') {
									value.time = [value.time];

								}
								outputBrown.push(value);
							}
						});

						// preInputAry.sort(function(a,b) {return (a.timeComp> b.timeComp) ? 1 : ((b.timeComp> a.timeComp) ? -1 : 0);} );					
						// outputGreen.sort(function(a,b) {return (a.timeComp> b.timeComp) ? 1 : ((b.timeComp> a.timeComp) ? -1 : 0);} );
						// outputBrown.sort(function(a,b) {return (a.timeComp> b.timeComp) ? 1 : ((b.timeComp> a.timeComp) ? -1 : 0);} );

						var arrayTimeUni = [];
						var arrayTimeGreen = [];
						var arrayTimeBrown = [];
						var array1 = [];
						var array2 = [];
						// array3.push(preInputAry.filter(function(obj) {
						// 	return outputBrown.indexOf(obj) == -1; 
						// }));

						for (var q = 0; q < preInputAry.length; q++) {
							arrayTimeUni.push(preInputAry[q].timeComp);
						}

						for (var q = 0; q < outputBrown.length; q++) {
							arrayTimeBrown.push(outputBrown[q].timeComp);
						}

						for (var q = 0; q < outputGreen.length; q++) {
							arrayTimeGreen.push(outputGreen[q].timeComp);
						}

						if (outputGreen.length < preInputAry.length) {
							array1.push(arrayTimeUni.filter(function(obj) {
								return arrayTimeGreen.indexOf(obj) == -1;
							}));

							var tempGreenCount = preInputAry.length - outputGreen.length;
							for (var t = 0; t < tempGreenCount; t++) {
								outputGreen.push({
									cmpny: [],
									timeComp: array1[0][t]
								});
							}
						}

						if (outputBrown.length < preInputAry.length) {
							array2.push(arrayTimeUni.filter(function(obj) {
								return arrayTimeBrown.indexOf(obj) == -1;
							}));

							var tempBrownCount = preInputAry.length - outputBrown.length;
							for (var t = 0; t < tempBrownCount; t++) {
								outputBrown.push({
									cmpny: [],
									timeComp: array2[0][t]
								});
							}
						}

						preInputAry.sort(function(a, b) {
							return (new Date(a.timeComp) > new Date(b.timeComp)) ? 1 : ((new Date(b.timeComp) > new Date(a.timeComp)) ? -1 : 0);
						});

						outputBrown.sort(function(a, b) {
							return (new Date(a.timeComp) > new Date(b.timeComp)) ? 1 : ((new Date(b.timeComp) > new Date(a.timeComp)) ? -1 : 0);
						});

						outputGreen.sort(function(a, b) {
							return (new Date(a.timeComp) > new Date(b.timeComp)) ? 1 : ((new Date(b.timeComp) > new Date(a.timeComp)) ? -1 : 0);
						});

						var uniqueBrown = [];
						for (var z = 0; z < outputBrown.length; z++) {
							var tempODATA = outputBrown[z].cmpny;
							uniqueBrown[z] = tempODATA.filter(function(itm, i, tempODATA) {
								return i == tempODATA.indexOf(itm);
							});
						}

						for (var z = 0; z < outputBrown.length; z++) {
							outputBrown[z].cmpny = uniqueBrown[z];
						}

						var uniqueGreen = [];
						for (var z = 0; z < outputGreen.length; z++) {
							var tempODATA = outputGreen[z].cmpny;
							uniqueGreen[z] = tempODATA.filter(function(itm, i, tempODATA) {
								return i == tempODATA.indexOf(itm);
							});
						}
						for (var z = 0; z < outputGreen.length; z++) {
							outputGreen[z].cmpny = uniqueGreen[z];
						}

						// preInputAry.sort(function(a, b) {
						// 	return (new Date(a.timeComp) > new Date(b.timeComp)) ? 1 : ((new Date(b.timeComp) > new Date(a.timeComp)) ? -1 : 0);
						// });

						for (var w = 0; w < preInputAry.length; w++) {
							if (outputBrown[w] == undefined) {
								outputBrown[w] = [];
								outputBrown[w].cmpny = [];
								// outputBrown[w].cmpny.length = 0;
							}
							if (outputGreen[w] == undefined) {
								outputGreen[w] = [];
								outputGreen[w].cmpny = [];
								// outputGreen[w].cmpny.length = 0;
							}

							inputFeedArry.push({
								time: preInputAry[w].timeComp,
								cmpny: outputGreen[w].cmpny.length,
								cmpny1: outputBrown[w].cmpny.length
							});
						}

						window.globalTempGreen = outputGreen;
						window.globalTempBrown = outputBrown;
						
						var tempInputArray = [];
						var tempRefVar = [];

						// for (var w = 0; w < inputFeedArry.length; w++) {
						// 	if(inputFeedArry[w].time==refFromDate){
						// 		tempRefVar.push(w);
						// 	}
						// 	if(inputFeedArry[w].time==refToDate){
						// 		tempRefVar.push(w);
						// 	}
						// }
						
						// var count = tempRefVar[tempRefVar.length - 1];
						// var missing = [];
						// for ( var i = tempRefVar[0]; i <= count; i++ ) {
						// 	if (tempRefVar.indexOf(i) == -1) {
						// 		missing.push(i);
						// 	}
						// }
						// var totalAry = tempRefVar.concat(missing);
						// totalAry.sort(function (a, b) {  return a - b;  });
						
						// for(var q=0;q<totalAry.length;q++){
						// 	tempInputArray.push(inputFeedArry[totalAry[q]]);
						// }
						
						oDataCHSTLine = {
							data: inputFeedArry
						};

						var oModelLineChartSVAccDetailBtm = sap.ui.getCore().getModel("oModelLineChartSVAccDetailBtm");
						oModelLineChartSVAccDetailBtm.setData(oDataCHSTLine);

						// var oVizFrame = me.getView().byId("HBarChart");

						// oVizFrame.destroyFeeds();

						// var oDataset = new sap.viz.ui5.data.FlattenedDataset({
						// 	dimensions: [{
						// 		name: "Time",
						// 		value: "{time}"

						// 	}],
						// 	measures: [{
						// 		name: "Green Field Customers",
						// 		value: "{cmpny}"
						// 	}, {
						// 		name: "Brown Field Customers",
						// 		value: "{cmpny1}"
						// 	}],

						// 	data: {
						// 		path: "/data"
						// 	}
						// });

						// oVizFrame.setDataset(oDataset);
						// oVizFrame.setModel(oModelLineChartSVAccDetailBtm);

						// var feedValueAxis = new sap.viz.ui5.controls.common.feeds.FeedItem({
						// 	'uid': "valueAxis",
						// 	'type': "Measure",
						// 	'values': ["Green Field Customers"]
						// });
						// var feedValueAxis2 = new sap.viz.ui5.controls.common.feeds.FeedItem({
						// 	'uid': "valueAxis",
						// 	'type': "Measure",
						// 	'values': ["Brown Field Customers"]
						// });
						// var feedCategoryAxis = new sap.viz.ui5.controls.common.feeds.FeedItem({
						// 	'uid': "categoryAxis",
						// 	'type': "Dimension",
						// 	'values': ["Time"]
						// });
						// oVizFrame.addFeed(feedValueAxis);
						// oVizFrame.addFeed(feedValueAxis2);
						// oVizFrame.addFeed(feedCategoryAxis);
						
						
						
						

						// oVizFrame.setVizProperties({
						// 	plotArea: {
						// 		dataLabel: {
						// 			// formatString:formatPattern.SHORTFLOAT_MFD2,
						// 			visible: true,
						// 			style: {
						// 				color: "#fff"
						// 			}
						// 		},
						// 		colorPalette: ['#427CAC', '#dddddd'],
						// 		gridline: {
						// 			visible: false
						// 		}
						// 	},
						// 	general: {
						// 		background: {
						// 			color: "#555"
						// 		},
						// 	},
						// 	valueAxis: {
						// 		label: {
						// 			style: {
						// 				color: "#ddd"
						// 			}
						// 			// formatString: formatPattern.SHORTFLOAT
						// 		},
						// 		title: {
						// 			visible: false
						// 		},
						// 	},
						// 	categoryAxis: {
						// 		title: {
						// 			visible: false
						// 		},
						// 		label: {
						// 			style: {
						// 				color: "#ddd"
						// 			}
						// 		},
						// 		hoverShadow: {
						// 			color: "#000"
						// 		},
						// 		mouseDownShadow: {
						// 			color: "#7b7878"
						// 		}
						// 	},
						// 	title: {
						// 		visible: false,
						// 		text: ' '
						// 	}
						// });

						// oVizFrame.setVizProperties({
						// 	plotArea: {
						// 		dataLabel: {
						// 			visible: true,
						// 			//formatString: CustomerFormat.FIORI_LABEL_SHORTFORMAT_2,
						// 			type: "short",
						// 			style: {
						// 				color: "#fff"
						// 			}
						// 		},
						// 		gap: {
						// 			barSpacing: 0.2,
						// 			groupSpacing: 0.2

						// 		},
						// 		dataPointSize: {
						// 			min: 10,
						// 			max: 20
						// 		},
						// 		drawingEffect: 'glossy',
						// 		colorPalette: ['#024084', '#86aed6'],
						// 		// colorPalette: ['#61BC52', '#302720,#4c4540'],
						// 		gridline: {
						// 			visible: false
						// 		}
						// 	},
						// 	general: {
						// 		background: {
						// 			color: "transparent"
						// 		},
						// 	},
						// 	categoryAxis: {
						// 		title: {
						// 			visible: false
						// 		},
						// 		label: {
						// 			style: {
						// 				color: "#ddd"
						// 			}
						// 		},
						// 		hoverShadow: {
						// 			color: "#000"
						// 		},
						// 		mouseDownShadow: {
						// 			color: "#7b7878"
						// 		},
						// 	},
						// 	valueAxis: {
						// 		label: {
						// 			style: {
						// 				color: "#ddd"
						// 			}
						// 		},
						// 		title: {
						// 			visible: false
						// 		}
						// 	},
						// 	legend: {
						// 		drawingEffect: 'glossy',
						// 		label: {
						// 			style: {
						// 				color: "#ddd"
						// 			}
						// 		},
						// 		hoverShadow: {
						// 			color: "#000"
						// 		},
						// 		mouseDownShadow: {
						// 			color: "#7b7878"
						// 		}
						// 	},
						// 	legendGroup: {
						// 		layout: {
						// 			position: 'bottom'
						// 		}
						// 	}

						// });
						
						
						// oVizFrame.setLegendVisible(false);
					}
					}else{
						var oDataCHSTLine = {
							data: []
						};

						var oModelLineChartSVAccDetailBtm = sap.ui.getCore().getModel("oModelLineChartSVAccDetailBtm");
						oModelLineChartSVAccDetailBtm.setData(oDataCHSTLine);

					}
				},
				function(oError) {
					console.log("Error 127");
				});
		},

		onSelect: function(oEvent) {
			
			// var chart = $("#repoContainerReview").highcharts();
			// var selectedPoints = chart.getSelectedPoints();
			// if(selectedPoints.length>0){
			// 	selectedPoints[0].select();	
			// }
	        // selectedPoints[0].select();
        
        	var chartArea = $("#repoContainerReviewArea").highcharts();
			var selectedPointsArea = chartArea.getSelectedPoints();
			if(selectedPointsArea.length>0){
				selectedPointsArea[0].select();	
			}
			
			var chartDay = $("#repoContainerReviewAreaDay").highcharts();
			var selectedPointsDay = chartDay.getSelectedPoints();
			if(selectedPointsDay.length>0){
				selectedPointsDay[0].select();	
			}
	        // selectedPointsArea[0].select();
        

			// this.getView().byId("ddlUpgrade").setSelectedKey("All");
			// this.getView().byId("searchfield").setValue("");
			this.getView().byId("filterLabel").setText("All Customers");
			this.getView().byId("cancelBtn").setVisible(false);

			var tempAry = [];
			var tempAryTime = [];

			var aSelections = oEvent.getParameter("data");
			for (var i = 0; i < aSelections.length; i++) {
				this._selectedData.push(aSelections[i].data);
			};

			for (var j = 0; j < this._selectedData.length; j++) {
				tempAry.push({
					name: this._selectedData[j].measureNames,
					time: this._selectedData[j].Time
				});
			}
			
			

			var aFilters = [];
			var tempBrown = window.globalTempBrown;
			var tempGreen = window.globalTempGreen;
			for (var j = 0; j < tempAry.length; j++) {
				if (tempAry[j].name == "Green Field Customers") {
					for (var t = 0; t < tempGreen.length; t++) {
						if (tempGreen[t].timeComp == tempAry[j].time) {
							for (var q = 0; q < tempGreen[t].cmpny.length; q++) {
								// var filter = new sap.ui.model.Filter("val", sap.ui.model.FilterOperator.Contains, tempGreen[t].cmpny[q]);
								var filter = new sap.ui.model.Filter("val", sap.ui.model.FilterOperator.EQ, tempGreen[t].cmpny[q]);
								aFilters.push(filter);
							}
						}
					}
				} else if (tempAry[j].name == "Brown Field Customers") {
					for (var w = 0; w < tempBrown.length; w++) {
						if (tempBrown[w].timeComp == tempAry[j].time) {
							for (var q = 0; q < tempBrown[w].cmpny.length; q++) {
								// var filter = new sap.ui.model.Filter("val", sap.ui.model.FilterOperator.Contains, tempBrown[w].cmpny[q]);
								var filter = new sap.ui.model.Filter("val", sap.ui.model.FilterOperator.EQ, tempBrown[w].cmpny[q]);
								aFilters.push(filter);
							}
						}
					}
				}
			}

			if (aFilters.length > 1) {
				var textAry = [];
				window.glblFlag = true;
				for(var q=0;q<tempAry.length;q++){
					if(tempAry[q].name=="Green Field Customers"){
						textAry.push("Green Field Customers");
						break;
					}
				}
				for(var q=0;q<tempAry.length;q++){
					if(tempAry[q].name=="Brown Field Customers"){
						textAry.push("Brown Field Customers");
						break;
					}
				}
				this.getView().byId("filterLabel").setText(textAry.toString());
				this.getView().byId("cancelBtn").setVisible(true);
			} else {
				window.glblFlag = false;
				this.getView().byId("filterLabel").setText("All Customers");
				this.getView().byId("cancelBtn").setVisible(false);
			}

			// update list binding
			var list = this.getView().byId("listTable");
			var binding = list.getBinding("items");
			binding.filter(aFilters, "Application");
		},

		onDeselect: function(oEvent) {
			var tempAry = [];
			var aSelections = oEvent.getParameter("data");
			for (var i = 0; i < aSelections.length; i++) {
				for (var j = 0; j < this._selectedData.length; j++) {
					if (this._selectedData[j] === aSelections[i].data) {
						this._selectedData.splice(j, 1);
						break;
					}
				};
			};

			for (var j = 0; j < this._selectedData.length; j++) {
				tempAry.push({
					name: this._selectedData[j].measureNames,
					time: this._selectedData[j].Time
				});
			}

			var aFilters = [];
			var tempBrown = window.globalTempBrown;
			var tempGreen = window.globalTempGreen;
			for (var j = 0; j < tempAry.length; j++) {
				if (tempAry[j].name == "Green Field Customers") {
					for (var t = 0; t < tempGreen.length; t++) {
						if (tempGreen[t].timeComp == tempAry[j].time) {
							for (var q = 0; q < tempGreen[t].cmpny.length; q++) {
								// var filter = new sap.ui.model.Filter("val", sap.ui.model.FilterOperator.Contains, tempGreen[t].cmpny[q]);
								var filter = new sap.ui.model.Filter("val", sap.ui.model.FilterOperator.EQ, tempGreen[t].cmpny[q]);
								aFilters.push(filter);
							}
						}
					}
				} else if (tempAry[j].name == "Brown Field Customers") {
					for (var w = 0; w < tempBrown.length; w++) {
						if (tempBrown[w].timeComp == tempAry[j].time) {
							for (var q = 0; q < tempBrown[w].cmpny.length; q++) {
								// var filter = new sap.ui.model.Filter("val", sap.ui.model.FilterOperator.Contains, tempBrown[w].cmpny[q]);
								var filter = new sap.ui.model.Filter("val", sap.ui.model.FilterOperator.EQ, tempBrown[w].cmpny[q]);
								aFilters.push(filter);
							}
						}
					}
				}
			}
			
			if (aFilters.length > 1) {
				
			} else {
				this.getView().byId("filterLabel").setText("All Customers");
				this.getView().byId("cancelBtn").setVisible(false);
			}

			// update list binding
			var list = this.getView().byId("listTable");
			var binding = list.getBinding("items");
			binding.filter(aFilters, "Application");

			//var ddlItems = this.getView().byId("ddlSP").getItems();
			//for(var q=0;q<ddlItems.length;q++){
			//	for(var j=0;j<this._selectedData.length;j++){
			// 	if(ddlItems[q].getText()==this._selectedData[j].Element){
			// 		tempAry.push(ddlItems[q].getKey());
			// 	}	
			//	}
			//}
			//if(tempAry.length==0){
			//	tempAry.push("All");
			//}
			//this.getView().byId("ddlSP").setSelectedKeys(tempAry);
			//this.ddlSPChanged();
		},

		removeDuplicates: function(originalArray, prop) {
			var newArray = [];
			var lookupObject = {};

			for (var i in originalArray) {
				lookupObject[originalArray[i][prop]] = originalArray[i];
			}

			for (i in lookupObject) {
				newArray.push(lookupObject[i]);
			}
			return newArray;
		},
		NumberFormatOpp: function(val){
			if(val["type"]=="K"){
				return val["value"] * 1000;
			}else {
				if(val["value"]<1000){
					return val["value"]
				}
			}
		},
		NumberFormat: function(val) {
			if (val == "" || val == null) {
				val = 0;
			}
			if (isNaN(val)) {
				val = 0;
			}
			var num = {};
			val = Math.abs(val);
			if (val < 0) {
				val = Math.abs(val);
			} else {
				val;
			}
			if (val < 1000) {
				num["value"] = val.toFixed(0).replace(/(\d)(?=(\d{3})+\.)/g, '$1');
				num["type"] = "";
			} else if (val / 1000 < 1000) {
				num["value"] = (val / 1000).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1');
				num["type"] = "K";
			} else {
				num["value"] = (val / 1000000).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1');
				num["type"] = "M";
			}
			// else {
			//  num["value"] = (val / 1000000000).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
			//  num["type"] = "B";
			// }
			return num;
		}
	});

	function MentionChartXbyMonth(pattern, value) {
		var typeA = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
		var typeB = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
		if (pattern == "MM") {
			return (value + 1);
		}
		if (pattern == "MMM") {
			if (typeA[value - 1] == undefined) {
				typeA[value - 1] = "Dec";
			}
			return typeA[value - 1];
		}
		if (pattern == "MMMM") {
			return typeB[value - 1];
		}
		if (pattern == "MM/YYYY") {
			return "0";
		}
	};

	function MentionDayName(value) {
		var day = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
		return day[value];
	};

	function MentionGetMonthName(value) {
		var a = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
		return a[value];
	};

	function GetDDMM(date) {
		var d = date;
		var day = d.getDate();
		var month = MentionGetMonthName(d.getMonth());
		var year = d.getFullYear();
		var result = year + "-" + month;
		return result;
	};

	function GetDDMMYY(date) {
		var d = date;
		var day = d.getDate();
		var month = MentionGetMonthName(d.getMonth());
		var year = d.getFullYear();
		var result = year + "-" + month + "-" + day;
		return result;
	};
	
	function GetMMDD(date) {
		var d = date;
		var day = d.getDate();
		var month = MentionGetMonthName(d.getMonth());
		var year = d.getFullYear();
		var result = day + "-" + month;
		return result;
	};
	function GetMMDDYYYY(date) {
		var d = date;
		var day = d.getDate();
		var month = MentionGetMonthName(d.getMonth());
		var year = d.getFullYear();
		var result = day + "-" + month + "-" + year;
		return result;
	};
	Date.prototype.YYYYMMDD = function() {
		var yyyy = this.getFullYear().toString();
		var mm = (this.getMonth() + 1).toString(); // getMonth() is zero-based
		var dd = this.getDate().toString();
		return yyyy + "-" + (mm[1] ? mm : "0" + mm[0]) + "-" + (dd[1] ? dd : "0" + dd[0]); // padding
	};

	function stringToDate(dateStr) {
		// dateStr.replace(/-/g, '/');
		// var date = new Date(dateStr);
		// return date;
		
		var tempDate1 = dateStr.replace("-","/");
		var tempDate2 =tempDate1.replace("-","/");
		var date = new Date(tempDate2); 
		return date;

	};
});
Date.prototype.YYYYMMDD = function() {
	var yyyy = this.getFullYear().toString();
	var mm = (this.getMonth() + 1).toString(); // getMonth() is zero-based
	var dd = this.getDate().toString();
	return yyyy + "-" + (mm[1] ? mm : "0" + mm[0]) + "-" + (dd[1] ? dd : "0" + dd[0]); // padding
};