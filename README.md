# Home Assistant Lovelace Strategy - Cave A Vin

This is a custom Lovelace strategy for Home Assistant that displays wine storage information in a visually appealing way. It creates a layout to represent wine storage shelves and bottles in a wine cellar.

## Installation

1. Copy the content of the `strategy-cave-a-vin.js` file.
2. In your Home Assistant configuration, create a new JavaScript resource file or open an existing one.
3. Paste the copied content into the JavaScript resource file.
4. Save the changes.

## Usage

To use this custom strategy, follow these steps:

1. Add wine storage entities to your Home Assistant configuration. These entities should follow a specific naming pattern like `sensor.cave_pl_clayX_bteY_qte` and `sensor.cave_pl_clayX_bteY_rg`, where `X` and `Y` represent placeholders for the shelf and bottle numbers.
2. Configure the `strategy-cave-a-vin.js` file as a Lovelace resource in your Home Assistant Lovelace configuration.
3. Create a Lovelace view and add this custom strategy to it.

```yaml
views:
  - title: Wine Cellar
    path: wine-cellar
    icon: mdi:wine-bottle
    cards:
      - type: "custom:ll-strategy-pl-cave"
