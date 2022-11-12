/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

import { Component, ChangeEventHandler, KeyboardEventHandler } from "react";
import moment from "moment";
import dateMath from "@elastic/datemath";
import { htmlIdGenerator } from "../../../services";
import { EuiButton, EuiButtonIcon } from "../../../button";
import { EuiFlexGroup, EuiFlexItem } from "../../../flex";
import { EuiSpacer } from "../../../spacer";
import { EuiSelect, EuiFieldNumber } from "../../../form";
import { EuiToolTip } from "../../../tool_tip";
import { EuiI18n } from "../../../i18n";
import { ApplyTime, QuickSelect, TimeUnitId } from "../../types";
import { TimeOptions, NEXT } from "../time_options";
import { parseTimeParts } from "./quick_select_utils";

type EuiQuickSelectState = QuickSelect;

export interface EuiQuickSelectProps {
  applyTime: ApplyTime;
  start: string;
  end: string;
  prevQuickSelect?: EuiQuickSelectState;
  timeOptions: TimeOptions;
}

export class EuiQuickSelect extends Component<
  EuiQuickSelectProps,
  EuiQuickSelectState
> {
  constructor(props: EuiQuickSelectProps) {
    super(props);

    const {
      timeTense: timeTenseDefault,
      timeUnits: timeUnitsDefault,
      timeValue: timeValueDefault,
    } = parseTimeParts(props.start, props.end);

    this.state = {
      timeTense:
        props.prevQuickSelect && props.prevQuickSelect.timeTense
          ? props.prevQuickSelect.timeTense
          : timeTenseDefault,
      timeValue:
        props.prevQuickSelect && props.prevQuickSelect.timeValue
          ? props.prevQuickSelect.timeValue
          : timeValueDefault,
      timeUnits:
        props.prevQuickSelect && props.prevQuickSelect.timeUnits
          ? props.prevQuickSelect.timeUnits
          : timeUnitsDefault,
    };
  }

  generateId = htmlIdGenerator();
  timeSelectionId = this.generateId();
  legendId = this.generateId();

  onTimeTenseChange: ChangeEventHandler<HTMLSelectElement> = (event) => {
    this.setState({
      timeTense: event.target.value,
    });
  };

  onTimeValueChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    const sanitizedValue = parseInt(event.target.value, 10);
    this.setState({
      timeValue: isNaN(sanitizedValue) ? 0 : sanitizedValue,
    });
  };

  onTimeUnitsChange: ChangeEventHandler<HTMLSelectElement> = (event) => {
    this.setState({
      timeUnits: event.target.value as TimeUnitId,
    });
  };

  handleKeyDown: KeyboardEventHandler<HTMLElement> = ({ key }) => {
    if (key === "Enter") {
      this.applyQuickSelect();
    }
  };

  applyQuickSelect = () => {
    const { timeTense, timeValue, timeUnits } = this.state;

    if (timeTense === NEXT) {
      this.props.applyTime({
        start: "now",
        end: `now+${timeValue}${timeUnits}`,
        quickSelect: { ...this.state },
      });
      return;
    }

    this.props.applyTime({
      start: `now-${timeValue}${timeUnits}`,
      end: "now",
      quickSelect: { ...this.state },
    });
  };

  getBounds = () => {
    const startMoment = dateMath.parse(this.props.start);
    const endMoment = dateMath.parse(this.props.end, { roundUp: true });
    return {
      min:
        startMoment && startMoment.isValid()
          ? startMoment
          : moment().subtract(15, "minute"),
      max: endMoment && endMoment.isValid() ? endMoment : moment(),
    };
  };

  stepForward = () => {
    const { min, max } = this.getBounds();
    const diff = max.diff(min);
    this.props.applyTime({
      start: moment(max).add(1, "ms").toISOString(),
      end: moment(max)
        .add(diff + 1, "ms")
        .toISOString(),
      keepPopoverOpen: true,
    });
  };

  stepBackward = () => {
    const { min, max } = this.getBounds();
    const diff = max.diff(min);
    this.props.applyTime({
      start: moment(min)
        .subtract(diff + 1, "ms")
        .toISOString(),
      end: moment(min).subtract(1, "ms").toISOString(),
      keepPopoverOpen: true,
    });
  };

  render() {
    const { timeTense, timeValue, timeUnits } = this.state;
    const { timeTenseOptions, timeUnitsOptions } = this.props.timeOptions;

  
 
    return (
      <fieldset>
        <EuiFlexGroup
          responsive={false}
          alignItems="center"
          justifyContent="spaceBetween"
          gutterSize="s"
        >
          <EuiFlexItem grow={false}>
            <EuiI18n
              token="euiQuickSelect.quickSelectTitle"
              default="Quick select"
            >
              {(quickSelectTitle: string) => (
                <div aria-hidden className="euiFormLabel">
                  {quickSelectTitle}
                </div>
              )}
            </EuiI18n>
          </EuiFlexItem>
          <EuiFlexItem grow={false}>
            <EuiFlexGroup alignItems="center" gutterSize="s" responsive={false}>
              <EuiFlexItem grow={false}>
                <EuiI18n
                  token="euiQuickSelect.previousLabel"
                  default="Previous time window"
                >
                  {(previousLabel: string) => (
                    <EuiToolTip content={previousLabel}>
                      <EuiButtonIcon
                        aria-label={previousLabel}
                        iconType="arrowLeft"
                        onClick={this.stepBackward}
                      />
                    </EuiToolTip>
                  )}
                </EuiI18n>
              </EuiFlexItem>
              <EuiFlexItem grow={false}>
                <EuiI18n
                  token="euiQuickSelect.nextLabel"
                  default="Next time window"
                >
                  {(nextLabel: string) => (
                    <EuiToolTip content={nextLabel}>
                      <EuiButtonIcon
                        aria-label={nextLabel}
                        iconType="arrowRight"
                        onClick={this.stepForward}
                      />
                    </EuiToolTip>
                  )}
                </EuiI18n>
              </EuiFlexItem>
            </EuiFlexGroup>
          </EuiFlexItem>
        </EuiFlexGroup>
        <EuiSpacer size="s" />
        <EuiFlexGroup gutterSize="s" responsive={false}>
          <EuiFlexItem>
            <EuiI18n token="euiQuickSelect.tenseLabel" default="Time tense">
              {(tenseLabel: string) => (
                <EuiSelect
                  compressed
                  onKeyDown={this.handleKeyDown}
                  aria-label={tenseLabel}
                  aria-describedby={`${this.timeSelectionId} ${this.legendId}`}
                  value={timeTense}
                  options={timeTenseOptions}
                  onChange={this.onTimeTenseChange}
                />
              )}
            </EuiI18n>
          </EuiFlexItem>
          <EuiFlexItem>
            <EuiI18n token="euiQuickSelect.valueLabel" default="Time value">
              {(valueLabel: string) => (
                <EuiFieldNumber
                  compressed
                  onKeyDown={this.handleKeyDown}
                  aria-describedby={`${this.timeSelectionId} ${this.legendId}`}
                  aria-label={valueLabel}
                  value={timeValue}
                  onChange={this.onTimeValueChange}
                />
              )}
            </EuiI18n>
          </EuiFlexItem>
          <EuiFlexItem>
            <EuiI18n token="euiQuickSelect.unitLabel" default="Time unit">
              {(unitLabel: string) => (
                <EuiSelect
                  compressed
                  onKeyDown={this.handleKeyDown}
                  aria-label={unitLabel}
                  aria-describedby={`${this.timeSelectionId} ${this.legendId}`}
                  value={timeUnits}
                  options={timeUnitsOptions}
                  onChange={this.onTimeUnitsChange}
                />
              )}
            </EuiI18n>
          </EuiFlexItem>
          <EuiFlexItem grow={false}>
            <EuiButton
              aria-describedby={`${this.timeSelectionId} ${this.legendId}`}
              className="euiQuickSelect__applyButton"
              size="s"
              onClick={this.applyQuickSelect}
              disabled={timeValue <= 0}
            >
              <EuiI18n token="euiQuickSelect.applyButton" default="Apply" />
            </EuiButton>
          </EuiFlexItem>
        </EuiFlexGroup>
      </fieldset>
    );
  }
}
