/**
 * Created by Andie on 1/22/2015.
 */

define(
    ["namespace", "common/namespace", "common/module.require"],
    function(namespace, ctrlNamespace){

        describe(ctrlNamespace, function() {

            //Adding an anonymous so that the tests stay somewhat packaged together.
            (function() {
                //The name of the factory we are testing
                var name = ctrlNamespace + ".utilityFactory";

                //The variable to hold the utilityFactory
                var utilityFactory;

                beforeEach(function () {
                    //Mock the app module
                    module(namespace);

                    inject(function ($injector) {
                        //use $injector to pull get the utilityFactory!
                        utilityFactory = $injector.get(name);
                    });
                });

                describe(name, function () {
                    it("findById", function () {
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

                        expect(utilityFactory.findById(data, 1).value).toEqual(1);

                        expect(utilityFactory.findById(data, 10)).toEqual("");
                    });
                });
            })();
        });

    });