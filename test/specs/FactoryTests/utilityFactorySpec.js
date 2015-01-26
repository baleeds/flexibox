/**
 * Created by Andie on 1/22/2015.
 */

define(
    ["../../../app/namespace", "common/namespace", "common/module.require"],
    function(namespace, ctrlNamespace){

        //The name of the factory we are testing
        var name = ctrlNamespace + ".utilityFactory";

        describe(name, function() {

            //The variable to hold the utilityFactory
            var utilityFactory;

            var data = [
                {_id: 1, value: 1},
                {_id: 2, value: 2},
                {_id: 3, value: 3},
                {_id: 4, value: 4},
                {_id: 5, value: 5},
                {_id: 6, value: 6},
                {_id: 7, value: 7},
                {_id: 8, value: 8}
            ];

            beforeEach(function () {
                //Mock the app module
                module(namespace);

                inject(function ($injector) {
                    //use $injector to pull get the utilityFactory!
                    utilityFactory = $injector.get(name);
                });
            });

            describe("findById tests", function () {

                it("Valid input data and valid _id search", function () {
                    expect(utilityFactory.findById(data, 1).value).toEqual(1);
                });

                it("Valid input data but _id search", function(){

                    expect(utilityFactory.findById(data, 10)).toEqual("");
                });
            });

            describe("findIndexById tests", function () {

                it("Valid input data and valid _id search", function () {
                    expect(utilityFactory.findIndexById(data, 1)).toEqual(0);
                });

                it("Valid input data and valid _id search", function () {
                    expect(utilityFactory.findIndexById(data, 4)).toEqual(3);
                });

                it("Valid input data but _id search", function(){

                    expect(utilityFactory.findIndexById(data, 10)).toEqual("");
                });
            });

            describe("randomColor tests", function () {
                var regex = /rgb\((\d{1,3}),(\d{1,3}),(\d{1,3})\)/;

                it("Expected pattern", function() {
                    expect(regex.test(utilityFactory.randomColor(5))).toEqual(true);
                });
            })

        });

    });