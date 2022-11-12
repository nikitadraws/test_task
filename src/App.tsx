import { useState } from "react";
import { EuiSuperDatePicker } from "./date_picker/super_date_picker";

function App() {
  const [isDisabled, setIsDisabled] = useState(false);
  const [isAutoRefreshOnly, setIsAutoRefreshOnly] = useState(false);
  const [showUpdateButton, setShowUpdateButton] = useState(true);
  const [recentlyUsedRanges, setRecentlyUsedRanges] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [start, setStart] = useState("now-30m");
  const [end, setEnd] = useState<any>("now");
  const [isPaused, setIsPaused] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState();

  const onTimeChange = ({ start, end }: any) => {
    const recentlyUsedRange = recentlyUsedRanges.filter((recentlyUsedRange) => {
      const isDuplicate =
        recentlyUsedRange.start === start && recentlyUsedRange.end === end;
      return !isDuplicate;
    });
    recentlyUsedRange.unshift({ start, end });
    setStart(start);
    setEnd(end);
    setRecentlyUsedRanges(
      recentlyUsedRange.length > 10
        ? recentlyUsedRange.slice(0, 9)
        : recentlyUsedRange
    );
    setIsLoading(true);
    startLoading();
  };

  const onRefresh = ({ start, end, refreshInterval }: any) => {
    return new Promise((resolve) => {
      setTimeout(resolve, 100);
    }).then(() => {
      console.log(start, end, refreshInterval);
    });
  };

  const startLoading = () => {
    setTimeout(stopLoading, 1000);
  };

  const stopLoading = () => {
    setIsLoading(false);
  };

  const onRefreshChange = ({ isPaused, refreshInterval }: any) => {
    setIsPaused(isPaused);
    setRefreshInterval(refreshInterval);
  };

  return (
    <div className="App">
      <div className="description-box">
        Some props for test:
        <label htmlFor="isDisabled">
          <input
            id="isDisabled"
            onClick={() => setIsDisabled((prev) => !prev)}
            type="checkbox"
          />{" "}
          isDisabled
        </label>
        <label htmlFor="showUpdateButton">
          <input
            id="showUpdateButton"
            onClick={() => setShowUpdateButton((prev) => !prev)}
            type="checkbox"
          />{" "}
          showUpdateButton
        </label>
        <label htmlFor="isAutoRefreshOnly">
          {" "}
          <input
            id="isAutoRefreshOnly"
            onClick={() => setIsAutoRefreshOnly((prev) => !prev)}
            type="checkbox"
          />{" "}
          isAutoRefreshOnly
        </label>
      </div>
      <EuiSuperDatePicker
        isAutoRefreshOnly={isAutoRefreshOnly}
        showUpdateButton={showUpdateButton}
        isDisabled={isDisabled}
        isLoading={isLoading}
        start={start}
        end={end}
        onTimeChange={onTimeChange}
        onRefresh={onRefresh}
        isPaused={isPaused}
        refreshInterval={refreshInterval}
        onRefreshChange={onRefreshChange}
        recentlyUsedRanges={recentlyUsedRanges}
      />
    </div>
  );
}

export default App;
