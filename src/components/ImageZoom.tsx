import type { HTMLAttributes } from "react"
import React from "react"
import MediumZoom from "react-medium-image-zoom"

import "react-medium-image-zoom/dist/styles.css"

export function Zoom({ children }: HTMLAttributes<HTMLDivElement>) {
    return (
        <MediumZoom wrapElement="div" zoomMargin={80} classDialog="zoom-image">
            {children}
        </MediumZoom>
    )
}