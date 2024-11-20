import React, {
  ChangeEvent,
  useCallback,
  useEffect,
  useState,
  useRef,
} from "react"
import "@/styles/Slider.css"

interface SliderProps {
  min: number
  max: number
  value: { min: number; max: number }
  onChange: (values: { min: number; max: number }) => void
  renderLabel: (time: number) => string
}

const debounce = <T extends unknown[]>(func: (...args: T) => void, delay: number) => {
  let timer: ReturnType<typeof setTimeout>
  return (...args: T) => {
    clearTimeout(timer)
    timer = setTimeout(() => {
      func(...args)
    }, delay)
  }
}

const Slider: React.FC<SliderProps> = React.memo(
  ({ min, max, value, onChange, renderLabel }) => {
    const [minVal, setMinVal] = useState(min)
    const [maxVal, setMaxVal] = useState(max)
    const rangeRef = useRef<HTMLDivElement>(null)

    const getPercent = useCallback(
      (val: number) => ((val - min) / (max - min)) * 100,
      [min, max]
    )

    useEffect(() => {
      if (value.min !== minVal) {
        setMinVal(value.min)
      }
      if (value.max !== maxVal) {
        setMaxVal(value.max)
      }
    }, [min, max])

    useEffect(() => {
      if (rangeRef.current) {
        const minPercent = getPercent(minVal)
        const maxPercent = getPercent(maxVal)
        rangeRef.current.style.left = `${minPercent}%`
        rangeRef.current.style.width = `${maxPercent - minPercent}%`
      }
    }, [minVal, maxVal, getPercent])

    const debouncedOnChange = useCallback(
      debounce((newValues: { min: number; max: number }) => {
        onChange(newValues)
      }, 300),
      [onChange]
    )

    const handleMinChange = (event: ChangeEvent<HTMLInputElement>) => {
      const newValue = Math.min(+event.target.value, maxVal - 1)
      setMinVal(newValue)
      debouncedOnChange({ min: newValue, max: maxVal })
    }

    const handleMaxChange = (event: ChangeEvent<HTMLInputElement>) => {
      const newValue = Math.max(+event.target.value, minVal + 1)
      setMaxVal(newValue)
      debouncedOnChange({ min: minVal, max: newValue })
    }

    return (
      <div className="flex-1 relative">
        <input
          type="range"
          min={min}
          max={max}
          value={minVal}
          onChange={handleMinChange}
          className={`w-full thumb thumb--zindex-3 ${
            minVal > max - 100 ? "thumb--zindex-5" : ""
          }`}
        />

        <input
          type="range"
          min={min}
          max={max}
          value={maxVal}
          onChange={handleMaxChange}
          className="w-full thumb thumb--zindex-4"
        />

        <div className="flex-1">
          <div className="slider-track"></div>
          <div ref={rangeRef} className="slider-range"></div>
          <div className="slider-left-value">Start: {renderLabel(minVal)}</div>
          <div className="slider-right-value">End: {renderLabel(maxVal)}</div>
        </div>
      </div>
    )
  }
)

Slider.displayName = 'Slider'
export default Slider
