import * as THREE from "three";
import { PATH_POINTS } from "../utils/config";

export const textSections = [
  {
    text: "A Glimpse Into Who We Are",
    position: new THREE.Vector3(
      PATH_POINTS[0].x - 4.1,
      PATH_POINTS[0].y - 1,
      PATH_POINTS[0].z - 55
    ),
    isTitle: true,
    maxWidth: 10,
  },
  {
    text: "We are a small agile team committed to creating exceptional online experiences that empower brands to elevate their digital presence.",
    position: new THREE.Vector3(
      PATH_POINTS[0].x + 5,
      PATH_POINTS[0].y + 1,
      PATH_POINTS[0].z - 70
    ),
    maxWidth: 7,
  },
  {
    text: "Bringing Vibrancy To Your Identity",
    position: new THREE.Vector3(
      PATH_POINTS[0].x - 4.1,
      PATH_POINTS[0].y + 2,
      PATH_POINTS[0].z - 130
    ),
    isTitle: true,
    maxWidth: 12,
  },
  {
    text: "By deeply understanding your products and services, we bring them to life, infusing vibrancy and a distinct presence that sets them apart in a crowded market.",
    position: new THREE.Vector3(
      PATH_POINTS[0].x + 5,
      PATH_POINTS[0].y + 1,
      PATH_POINTS[0].z - 170
    ),
    maxWidth: 7,
  },
  {
    text: "Crafting Great Brand Narrative",
    position: new THREE.Vector3(
      PATH_POINTS[0].x - 4.1,
      PATH_POINTS[0].y - 3,
      PATH_POINTS[0].z - 280
    ),
    isTitle: true,
    maxWidth: 12,
  },
  {
    text: "We create unique experiences that not only communicate your identity but also forge an emotional bond with your audience, creating a narrative that resonates and endures.",
    position: new THREE.Vector3(
      PATH_POINTS[0].x + 5,
      PATH_POINTS[0].y + 2,
      PATH_POINTS[0].z - 340
    ),
    maxWidth: 7,
  },
];
