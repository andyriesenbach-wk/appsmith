import _ from "lodash";

import { primaryColumnValidation } from "./propertyConfig";
import type { ListWidgetProps } from ".";

describe(".primaryColumnValidation", () => {
  it("validates uniqueness of values with valid input", () => {
    const props = {
      listData: [
        {
          id: 1,
        },
        {
          id: 2,
        },
      ],
    } as unknown as ListWidgetProps;

    const inputValue = [1, 2];

    const expectedOutput = {
      isValid: true,
      parsed: inputValue,
      messages: [{ name: "", message: "" }],
    };

    const output = primaryColumnValidation(inputValue, props, _);

    expect(output).toEqual(expectedOutput);
  });

  it("invalidates when input keys are not unique", () => {
    const props = {
      listData: [
        {
          id: 1,
        },
        {
          id: 2,
        },
      ],
    } as unknown as ListWidgetProps;

    const inputValue = [1, 2, 3];

    const expectedOutput = {
      isValid: false,
      parsed: [],
      messages: [
        {
          name: "ValidationError",
          message:
            "This data identifier is evaluating to a duplicate value. Please use an identifier that evaluates to a unique value.",
        },
      ],
    };

    const output = primaryColumnValidation(inputValue, props, _);

    expect(output).toEqual(expectedOutput);
  });

  it("returns empty with error when JS mode enabled and input value is non-array", () => {
    const props = {
      listData: [
        {
          id: 1,
        },
        {
          id: 2,
        },
      ],
      dynamicPropertyPathList: [{ key: "primaryKeys" }],
    } as unknown as ListWidgetProps;

    const inputs = [true, "true", 0, 1, undefined, null];

    inputs.forEach((input) => {
      const output = primaryColumnValidation(input, props, _);

      expect(output).toEqual({
        isValid: false,
        parsed: undefined,
        messages: [
          {
            name: "ValidationError",
            message:
              "Use currentItem or currentIndex to find a good data identifier. You can also combine two or more data attributes or columns.",
          },
        ],
      });
    });
  });

  it("returns empty with error when JS mode disabled and input value is non-array", () => {
    const props = {
      listData: [
        {
          id: 1,
        },
        {
          id: 2,
        },
      ],
    } as unknown as ListWidgetProps;

    const inputs = [true, "true", 0, 1, undefined, null];

    inputs.forEach((input) => {
      const output = primaryColumnValidation(input, props, _);

      expect(output).toEqual({
        isValid: false,
        parsed: undefined,
        messages: [
          {
            name: "ValidationError",
            message:
              "Select an option from the dropdown or toggle JS on to define a data identifier.",
          },
        ],
      });
    });
  });

  it(" returns empty with error when JS mode enabled and input is empty", () => {
    const props = {
      listData: [
        {
          id: 1,
        },
        {
          id: 2,
        },
      ],
      dynamicPropertyPathList: [{ key: "primaryKeys" }],
    } as unknown as ListWidgetProps;

    const input: unknown = [];

    const output = primaryColumnValidation(input, props, _);

    expect(output).toEqual({
      isValid: false,
      parsed: [],
      messages: [
        {
          name: "ValidationError",
          message:
            "This data identifier evaluates to an empty array. Please use an identifier that evaluates to a valid value.",
        },
      ],
    });
  });

  it(" primary key that doesn't exist", () => {
    const props = {
      listData: [
        {
          id: 1,
        },
        {
          id: 2,
        },
      ],
      dynamicPropertyPathList: [{ key: "primaryKeys" }],
    } as unknown as ListWidgetProps;

    const input: unknown = [null, null];

    const output = primaryColumnValidation(input, props, _);

    expect(output).toEqual({
      isValid: false,
      parsed: input,
      messages: [
        {
          name: "ValidationError",
          message:
            "This identifier isn't a data attribute. Use an existing data attribute as your data identifier.",
        },
      ],
    });
  });

  it(" primary key contain null value in array", () => {
    const props = {
      listData: [
        {
          id: 1,
        },
        {
          id: 12,
        },
        {
          id: 14,
        },
        {
          id: 11,
        },
      ],
      dynamicPropertyPathList: [{ key: "primaryKeys" }],
    } as unknown as ListWidgetProps;

    const input: unknown = [1, null, undefined, 4];

    const output = primaryColumnValidation(input, props, _);

    expect(output).toEqual({
      isValid: false,
      parsed: input,
      messages: [
        {
          name: "ValidationError",
          message:
            "This data identifier evaluates to null or undefined. Please use an identifier that evaluates to a valid value.",
        },
      ],
    });
  });
});
