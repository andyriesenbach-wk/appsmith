import { ObjectsRegistry } from "../../../../support/Objects/Registry";

const jsEditor = ObjectsRegistry.JSEditor,
  agHelper = ObjectsRegistry.AggregateHelper;

describe("JS Function Execution", function() {
  it("1. Allows execution of js function when lint warnings(not errors) are present in code", function() {
    jsEditor.CreateJSObject(
      `export default {
  	myFun1: ()=>{
  		f;
  		return "yes"
  	}
  }`,
      {
        paste: true,
        completeReplace: true,
        toRun: false,
        shouldNavigate: true,
      },
    );

    jsEditor.AssertParseError(false, false);
  });

  it("2. Prevents execution of js function when parse errors are present in code", function() {
    jsEditor.CreateJSObject(
      `export default {
  	myFun1: ()=>>{
  		return "yes"
  	}
  }`,
      {
        paste: true,
        completeReplace: true,
        toRun: false,
        shouldNavigate: true,
      },
    );

    jsEditor.AssertParseError(true, false);
  });

  it("3. Prioritizes parse errors that render JS Object invalid over function execution parse errors in debugger callouts", function() {
    const JSObjectWithFunctionExecutionParseErrors = `export default {  
      myFun1 :()=>{  
        return f
      }
    }`;

    const JSObjectWithParseErrors = `export default {
      myFun1:  (a ,b)=>>{
      return "yes"
      }
    }`;

    // create jsObject with parse error (that doesn't render JS Object invalid)
    jsEditor.CreateJSObject(JSObjectWithFunctionExecutionParseErrors, {
      paste: true,
      completeReplace: true,
      toRun: true,
      shouldNavigate: true,
    });

    // Assert presence of function execution parse error callout
    jsEditor.AssertParseError(true, true);

    // Add parse error that renders JS Object invalid in code
    jsEditor.CreateJSObject(JSObjectWithParseErrors, {
      paste: true,
      completeReplace: true,
      toRun: false,
      shouldNavigate: false,
    });

    // Assert presence of parse error callout (entire JS Object is invalid)
    jsEditor.AssertParseError(true, false);
  });

  it("4. Maintains order of async functions in settings tab alphabetically at all times", function() {
    const JS_OBJECT_BODY = `export default {
      getId: async () => {
        return 8;
      },
      zip: async () => {
        return 8;
      },
      assert: async () => {
        return 2
      }  ,
      base: async () => {
        return 3
      } ,
    }`;

    const assertAsyncFunctionsOrder = () => {
      cy.get(jsEditor._asyncJSFunctionSettings).then(function($lis) {
        const asyncFunctionLength = $lis.length;
        // Assert that there are four async functions
        expect(asyncFunctionLength).to.equal(4);
        // Expect the first on the list to be "assert"
        expect($lis.eq(0)).to.have.id(
          jsEditor._getJSFunctionSettingsId("assert"),
        );
        // Expect the second on the list to be "base"
        expect($lis.eq(1)).to.have.id(
          jsEditor._getJSFunctionSettingsId("base"),
        );
        // Expect the third on the list to be "getId"
        expect($lis.eq(2)).to.have.id(
          jsEditor._getJSFunctionSettingsId("getId"),
        );
        // Expect the last on the list to be "zip"
        expect($lis.eq(3)).to.have.id(jsEditor._getJSFunctionSettingsId("zip"));
      });
    };

    jsEditor.CreateJSObject(JS_OBJECT_BODY, {
      paste: true,
      completeReplace: true,
      toRun: false,
      shouldNavigate: true,
    });
    // Switch to settings tab
    agHelper.GetNClick(jsEditor._settingsTab);
    // Assert alphabetical order of async functions
    assertAsyncFunctionsOrder();
    // run a function
    cy.get(jsEditor._runButton)
      .first()
      .click()
      .wait(2000);
    // Assert that order remains the same
    assertAsyncFunctionsOrder();
  });
});
