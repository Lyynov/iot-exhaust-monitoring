export const LineChart = ({ children, data, margin }: any) => {
  return (
    <svg width="100%" height="100%" viewBox={`0 0 600 300`} style={{ overflow: "visible" }}>
      {children}
    </svg>
  )
}

export const Line = ({ type, dataKey, stroke, strokeWidth, dot, activeDot }: any) => {
  return <path d="M0,0 L600,0" stroke={stroke} strokeWidth={strokeWidth} />
}

export const XAxis = ({ dataKey, stroke, tick, tickLine }: any) => {
  return <line x1="0" y1="250" x2="600" y2="250" stroke={stroke} />
}

export const YAxis = ({ stroke, tick, tickLine, domain, label }: any) => {
  return <line x1="50" y1="0" x2="50" y2="300" stroke={stroke} />
}

export const CartesianGrid = ({ strokeDasharray, stroke }: any) => {
  return <rect width="100%" height="100%" fill="none" stroke={stroke} strokeDasharray={strokeDasharray} />
}

export const Tooltip = ({ contentStyle, formatter, labelFormatter }: any) => {
  return <div style={contentStyle}>Tooltip</div>
}

export const ResponsiveContainer = ({ children, width, height }: any) => {
  return <div style={{ width: "100%", height: "100%" }}>{children}</div>
}
