import { ChangeEvent, useCallback, useEffect, useState, useRef } from "react"
import "@/styles/Slider.css"

interface SliderProps {
  min: number
  max: number
  onChange: Function
  thumbs: number
}

const Slider: React.FC<SliderProps> = ({
  min,
  max,
  onChange,
  thumbs = 2,
}) => {
  const [minVal, setMinVal] = useState(min)
  const [maxVal, setMaxVal] = useState(max)
  const minValRef = useRef<HTMLInputElement>(null)
  const maxValRef = useRef<HTMLInputElement>(null)
  const range = useRef<HTMLDivElement>(null)

  const getPercent = useCallback(
    (value: number) => Math.round(((value - min) / (max - min)) * 100),
    [min, max]
  )

  useEffect(() => {
    if (thumbs === 2 && maxValRef.current) {
      const minPercent = getPercent(minVal)
      const maxPercent = getPercent(+maxValRef.current.value)

      if (range.current) {
        range.current.style.left = `${minPercent}%`
        range.current.style.width = `${maxPercent - minPercent}%`
      }
    }
  }, [minVal, maxVal, thumbs, getPercent])

  useEffect(() => {
    if (thumbs === 2) {
      onChange({ min: minVal, max: maxVal })
    } else {
      onChange({ value: minVal })
    }
  }, [minVal, maxVal, thumbs, onChange])

  return (
    <div className="flex-1 relative">
      <input
        type="range"
        min={min}
        max={max}
        value={minVal}
        ref={minValRef}
        onChange={(event: ChangeEvent<HTMLInputElement>) => {
          const value =
            thumbs === 2
              ? Math.min(+event.target.value, maxVal - 1)
              : +event.target.value
          setMinVal(value)
          event.target.value = value.toString()
        }}
        className={`w-full thumb thumb--zindex-3 ${
          thumbs === 2 && minVal > max - 100 ? "thumb--zindex-5" : ""
        }`}
      />

      {thumbs === 2 && (
        <input
          type="range"
          min={min}
          max={max}
          value={maxVal}
          ref={maxValRef}
          onChange={(event: ChangeEvent<HTMLInputElement>) => {
            const value = Math.max(+event.target.value, minVal + 1)
            setMaxVal(value)
            event.target.value = value.toString()
          }}
          className="w-full thumb thumb--zindex-4"
        />
      )}

      <div className="flex-1">
        <div className="slider-track"></div>
        {thumbs === 2 && <div ref={range} className="slider-range"></div>}
        <div className="slider-left-value">Start: {minVal}</div>
        {thumbs === 2 && <div className="slider-right-value">End: {maxVal}</div>}
      </div>
    </div>
  )
}

export default Slider
