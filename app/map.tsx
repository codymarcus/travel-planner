"use client"

import { useLayoutEffect } from "react"
import * as am5 from "@amcharts/amcharts5"
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated"
import * as am5map from "@amcharts/amcharts5/map"
import am5geodata_worldLow from "@amcharts/amcharts5-geodata/worldLow"

function Map({ locations }) {
  useLayoutEffect(() => {
    let root = am5.Root.new("chartdiv")
    am5.addLicense(process.env.NEXT_PUBLIC_AM_LICENSE)

    root.setThemes([am5themes_Animated.new(root)])

    const nonRepeatingLocations = locations.reduce((acc, location, index) => {
      if (index === 0 || locations[index - 1].name !== location.name)
        acc.push(location)
      return acc
    }, [])

    const uniqueLocations = nonRepeatingLocations.reduce((acc, location) => {
      if (!acc.find((l) => l.name === location.name)) acc.push(location)
      return acc
    }, [])

    // Get center of all locations
    const coordinatesSum = uniqueLocations.reduce(
      (acc, location) => {
        acc.latitude += location.latitude
        acc.longitude += location.longitude
        return acc
      },
      { latitude: 0, longitude: 0 }
    )
    const center = {
      latitude: coordinatesSum.latitude / uniqueLocations.length,
      longitude: coordinatesSum.longitude / uniqueLocations.length,
    }

    let chart = root.container.children.push(
      am5map.MapChart.new(root, {
        panX: "rotateX",
        panY: "translateY",
        projection: am5map.geoMercator(),
        homeGeoPoint: {
          latitude: center.latitude,
          longitude: center.longitude,
        },
        homeZoomLevel: 20,
      })
    )

    let cont = chart.children.push(
      am5.Container.new(root, {
        layout: root.horizontalLayout,
        x: 20,
        y: 40,
      })
    )

    // Create series for background fill
    // https://www.amcharts.com/docs/v5/charts/map-chart/map-polygon-series/#Background_polygon
    let backgroundSeries = chart.series.push(
      am5map.MapPolygonSeries.new(root, {})
    )
    backgroundSeries.mapPolygons.template.setAll({
      fill: am5.color("#ffeedb"),
      fillOpacity: 1,
      strokeOpacity: 0,
    })

    // Add background polygon
    // https://www.amcharts.com/docs/v5/charts/map-chart/map-polygon-series/#Background_polygon
    backgroundSeries.data.push({
      geometry: am5map.getGeoRectangle(90, 180, -90, -180),
    })

    // Create main polygon series for countries
    // https://www.amcharts.com/docs/v5/charts/map-chart/map-polygon-series/
    let polygonSeries = chart.series.push(
      am5map.MapPolygonSeries.new(root, {
        geoJSON: am5geodata_worldLow,
      })
    )

    // Create line series for trajectory lines
    // https://www.amcharts.com/docs/v5/charts/map-chart/map-line-series/
    let lineSeries = chart.series.push(am5map.MapLineSeries.new(root, {}))
    lineSeries.mapLines.template.setAll({
      stroke: am5.color(0xffba00),
      strokeOpacity: 1,
      strokeDasharray: [10],
      strokeWidth: 4,
    })

    // Create point series for markers
    // https://www.amcharts.com/docs/v5/charts/map-chart/map-point-series/
    let pointSeries = chart.series.push(am5map.MapPointSeries.new(root, {}))

    pointSeries.bullets.push(function () {
      let circle = am5.Circle.new(root, {
        radius: 7,
        cursorOverStyle: "pointer",
        tooltipY: 0,
        fill: am5.color(0xffba00),
        stroke: root.interfaceColors.get("background"),
        strokeWidth: 2,
        tooltipText: "{name}",
        showTooltipOn: "always",
        tooltip: am5.Tooltip.new(root, {}),
      })

      return am5.Bullet.new(root, {
        sprite: circle,
      })
    })

    const pointsToConnect = nonRepeatingLocations.map((location) => {
      return addCity(
        {
          latitude: location.latitude,
          longitude: location.longitude,
        },
        location.name
      )
    })
    let lineDataItem = lineSeries.pushDataItem({ pointsToConnect })

    polygonSeries.events.on("datavalidated", function () {
      chart.goHome()
    })

    function addCity(coords, title) {
      return pointSeries.pushDataItem({
        latitude: coords.latitude,
        longitude: coords.longitude,
        name: title,
      })
    }

    return () => {
      root.dispose()
    }
  }, [])

  return <div id="chartdiv" style={{ width: "100%", height: "100%" }}></div>
}
export default Map
