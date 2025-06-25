import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { useSliderWithInput } from "@/hooks/use-slider-with-input";
import { Button } from "@/components/ui/button";

function SliderWithInputDemo() {
  const {
    sliderValue,
    inputValues,
    validateAndUpdateValue,
    handleInputChange,
    handleSliderChange,
    resetToDefault,
  } = useSliderWithInput({
    minValue: 0,
    maxValue: 1000,
    initialValue: [200, 800],
    defaultValue: [200, 800],
  });

  return (
    <div className="w-full max-w-sm space-y-4">
      <div className="space-y-2">
        <Slider
          value={sliderValue}
          min={0}
          max={1000}
          step={1}
          onValueChange={handleSliderChange}
          className="py-4"
        />
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <Input
              type="text"
              value={inputValues[0]}
              onChange={(e) => handleInputChange(e, 0)}
              onBlur={() => validateAndUpdateValue(inputValues[0], 0)}
              className="w-24"
            />
            <span className="text-muted-foreground">to</span>
            <Input
              type="text"
              value={inputValues[1]}
              onChange={(e) => handleInputChange(e, 1)}
              onBlur={() => validateAndUpdateValue(inputValues[1], 1)}
              className="w-24"
            />
          </div>
          <div className="flex-1" />
          <Button variant="outline" onClick={resetToDefault}>
            Reset
          </Button>
        </div>
      </div>
    </div>
  );
}

export { SliderWithInputDemo };