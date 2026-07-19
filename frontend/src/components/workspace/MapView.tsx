"use client";

import { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import 'maplibre-gl/dist/maplibre-gl.css';
import { useInvestigation } from "@/context/InvestigationContext";

export default function MapView() {
    const mapContainer = useRef<HTMLDivElement>(null);
    const map = useRef<maplibregl.Map | null>(null);
    const { currentFIR } = useInvestigation();

    useEffect(() => {
        if (!mapContainer.current) return;
        if (map.current) return; // Initialize only once

        map.current = new maplibregl.Map({
            container: mapContainer.current,
            style: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json',
            center: [77.5946, 12.9716], // Bangalore
            zoom: 11
        });

        map.current.on('load', () => {
            if (!map.current) return;

            // Add mock heatmap source
            map.current.addSource('crimes', {
                type: 'geojson',
                data: {
                    type: 'FeatureCollection',
                    features: [
                        { type: 'Feature', geometry: { type: 'Point', coordinates: [77.5946, 12.9716] }, properties: { mag: 1 } },
                        { type: 'Feature', geometry: { type: 'Point', coordinates: [77.6245, 12.9352] }, properties: { mag: 1 } },
                    ]
                }
            });

            map.current.addLayer({
                id: 'crimes-heat',
                type: 'heatmap',
                source: 'crimes',
                maxzoom: 15,
                paint: {
                    'heatmap-weight': 1,
                    'heatmap-intensity': 1,
                    'heatmap-color': [
                        'interpolate',
                        ['linear'],
                        ['heatmap-density'],
                        0, 'rgba(33,102,172,0)',
                        0.2, 'rgb(103,169,207)',
                        0.4, 'rgb(209,229,240)',
                        0.6, 'rgb(253,219,199)',
                        0.8, 'rgb(239,138,98)',
                        1, 'rgb(178,24,43)'
                    ],
                    'heatmap-radius': 30,
                    'heatmap-opacity': 0.8
                }
            });
        });

    }, []);

    return (
        <div className="h-full relative rounded-lg overflow-hidden border">
            <div className="absolute top-4 left-4 z-10 bg-white/90 p-3 rounded shadow backdrop-blur text-sm max-w-xs">
                <div className="font-semibold mb-1">Crime Hotspot Prediction</div>
                <div className="text-xs text-slate-600">
                    MapLibre GL rendering predictive hotspots based on temporal and geographic AI analysis.
                </div>
            </div>
            <div ref={mapContainer} className="w-full h-full" />
        </div>
    );
}
