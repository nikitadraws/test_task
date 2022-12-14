_Forked by @elastic/eui from Hacker0x01/react-datepicker for accessibility and consolidation of services._

Decision to not use a more traditional "vendor" directory approach includes redundant services, unnecessary dependencies, and a separate build pipeline. Most notably, `react-datepicker` included third-party popover and focus trap service and components that do not align with EUI interaction standards and were replaced, at parity, with EUI components.

Other modifications:

* Changed to `.js` naming to conform to EUI build processes
* Removed files related to repository management and publishing
* Adjusted `babel.rc` and `package.json` naming to avoid babel configuration conflicts

___
# React Date Picker

[![npm version](https://badge.fury.io/js/react-datepicker.svg)](https://badge.fury.io/js/react-datepicker)
[![Build Status](https://travis-ci.org/Hacker0x01/react-datepicker.svg?branch=master)](https://travis-ci.org/Hacker0x01/react-datepicker)
[![Dependency Status](https://david-dm.org/Hacker0x01/react-datepicker.svg)](https://david-dm.org/Hacker0x01/react-datepicker)
[![codecov](https://codecov.io/gh/Hacker0x01/react-datepicker/branch/master/graph/badge.svg)](https://codecov.io/gh/Hacker0x01/react-datepicker)
[![Downloads](http://img.shields.io/npm/dm/react-datepicker.svg)](https://npmjs.org/package/react-datepicker)
[![Code Quality: Javascript](https://img.shields.io/lgtm/grade/javascript/g/Hacker0x01/react-datepicker.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/Hacker0x01/react-datepicker/context:javascript)
[![Total Alerts](https://img.shields.io/lgtm/alerts/g/Hacker0x01/react-datepicker.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/Hacker0x01/react-datepicker/alerts)

A simple and reusable Datepicker component for React ([Demo](https://reactdatepicker.com/))

![](https://cloud.githubusercontent.com/assets/1412392/5339491/c40de124-7ee1-11e4-9f07-9276e2545f27.png)

## Installation

The package can be installed via NPM:

```
npm install react-datepicker --save
```

You’ll need to install   PropTypes, and Moment.js separately since those dependencies aren’t included in the package. Below is a simple example of how to use the Datepicker in a React view. You will also need to require the CSS file from this package (or provide your own). The example below shows how to include the CSS from this package if your build system supports requiring CSS files (Webpack is one that does).

```js
import React from "react";
import DatePicker from "react-datepicker";
import moment from "moment";

import "react-datepicker/dist/react-datepicker.css";

// CSS Modules, react-datepicker-cssmodules.css
// import 'react-datepicker/dist/react-datepicker-cssmodules.css';

class Example extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      startDate: moment()
    };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(date) {
    this.setState({
      startDate: date
    });
  }

  render() {
    return (
      <DatePicker
        selected={this.state.startDate}
        onChange={this.handleChange}
      />
    );
  }
}
```

## Configuration

The most basic use of the DatePicker can be described with:

```js
<DatePicker selected={this.state.date} onChange={this.handleChange} />
```

You can use `onSelect` event handler which fires each time some calendar date has been selected

```js
<DatePicker
  selected={this.state.date}
  onSelect={this.handleSelect} //when day is clicked
  onChange={this.handleChange} //only when value has changed
/>
```

`onClickOutside` handler may be useful to close datepicker in `inline` mode

See [here](https://github.com/Hacker0x01/react-datepicker/blob/master/docs/datepicker.md) for a full list of props that may be passed to the component. Examples are given on the [main website](https://hacker0x01.github.io/react-datepicker).

### Time picker

You can also include a time picker by adding the showTimeSelect prop

```js
<DatePicker
  selected={this.state.date}
  onChange={this.handleChange}
  showTimeSelect
  dateFormat="LLL"
/>
```

Times will be displayed at 30-minute intervals by default (default configurable via timeInterval prop)

More examples of how to use the time picker are given on the [main website](https://hacker0x01.github.io/react-datepicker)

### Localization

The date picker relies on [moment.js internationalization](http://momentjs.com/docs/#/i18n/) to localize its display components. By default, the date picker will use the locale globally set in moment, which is English. Locales can be changed in the following ways:

* **Globally** by calling `moment.locale(lang)`
* **Picker-specific** by providing the `locale` prop

Locales can be further configured in moment with various [customization options](http://momentjs.com/docs/#/customization/).

_As of version 0.23, the `weekdays` and `weekStart` DatePicker props have been removed. Instead, they can be configured with the `weekdaysMin` and `week.dow` moment locale customization options._

## Compatibility

### React

We're always trying to stay compatible with the latest version of React. We can't support all older versions of React.

Latest compatible versions:

* React 15.5 or newer: All above React-datepicker v.0.40.0
* React 15.4.1: needs React-datepicker v0.40.0, newer won't work (due to react-onclickoutside dependencies)
* React 0.14 or newer: All above React-datepicker v0.13.0
* React 0.13: React-datepicker v0.13.0
* pre React 0.13: React-datepicker v0.6.2

### Browser Support

The date picker is compatible with the latest versions of Chrome, Firefox, and IE10+.

Unfortunately, it is difficult to support legacy browsers while maintaining our ability to develop new features in the future. For IE9 support, it is known that the [classlist polyfill](https://www.npmjs.com/package/classlist-polyfill) is needed, but this may change or break at any point in the future.

## Local Development

The `master` branch contains the latest version of the Datepicker component. To start your example app, you can run `yarn start`. This starts a simple webserver on http://localhost:8080.

You can run `yarn test` to execute the test suite and linters. To help you develop the component we’ve set up some tests that cover the basic functionality (can be found in `/tests`). Even though we’re big fans of testing, this only covers a small piece of the component. We highly recommend you add tests when you’re adding new functionality.

### The examples

The examples are hosted within the docs folder and are ran in the simple app that loads the Datepicker. To extend the examples with a new example, you can simply duplicate one of the existing examples and change the unique properties of your example.

## Accessibility

### Keyboard support

* _Left_: Move to the previous day.
* _Right_: Move to the next day.
* _Up_: Move to the previous week.
* _Down_: Move to the next week.
* _PgUp_: Move to the previous month.
* _PgDn_: Move to the next month.
* _Home_: Move to the previous year.
* _End_: Move to the next year.
* _Enter/Esc/Tab_: close the calendar. (Enter & Esc calls preventDefault)

## License

Copyright (c) 2018 HackerOne Inc. and individual contributors. Licensed under MIT license, see [LICENSE](LICENSE) for the full license.
