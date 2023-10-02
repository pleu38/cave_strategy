class StrategyCaveAVin {
    
// Function to fill missing cards in a horizontal stack
static fillMissingCards(HZStack) {
  if (HZStack.cards.length < 7) {
    const missingCardCount = 7 - HZStack.cards.length;
    for (let k = 0; k < missingCardCount; k++) {
      const missingCard = {
        "type": "custom:mushroom-template-card",
        "primary": 'Libre',
        "secondary": '',
        "icon": '',
        "icon_color": '',
        "fill_container": true,
        "picture": "/local/assets/bte_libre.png"
      };
      HZStack.cards.push(missingCard);
    }
  }
}
    
  static async generateView(info) {
    const [entities] = await Promise.all([
      info.hass.callWS({ type: "config/entity_registry/list" }),
    ]);
    const cards = [
      {
        type: "markdown",
        content: `Generated at ${(new Date()).toLocaleString()}`,
      },
      {
        "type": "custom:mushroom-title-card",
        "title": "🍷 CAVE A VIN 🍇",
        "alignment": "center"
      },
    ];
    // Create a vertical stack
    const verticalStack = {
      type: "vertical-stack",
      cards: [],
    };
    for (let i = 1; i <= 5; i++) {
      // Define the separator icon based on the value of i
      let separatorIcon = "mdi:fridge-bottom";
      if (i === 1) {
        separatorIcon = "mdi:fridge-industrial";
      } else if (i === 2 || i === 3) {
        separatorIcon = "mdi:fridge-top";
      }

      // Add a separator
      verticalStack.cards.push({
          type: "custom:bubble-card",
          card_type: "separator",
          name: 'Clayette ' + i,
          icon: separatorIcon
      });
      
      const horizontalStack = {
        type: "horizontal-stack",
        cards: [],
      };

      // Match sensors with naming pattern "sensor.cave_pl_clayX_bteY_qte" to corresponding bte_entity
      const sensorNamePattern = new RegExp(`sensor.cave_pl_clay${i}_bte\\d+_qte`);
      let nextHorizontalStack = null;

      entities.forEach((entity) => {
        //console.log(entity.entity_id.match(sensorNamePattern));
        if (entity.entity_id.match(sensorNamePattern)) {
          const sensorState = info.hass.states[entity.entity_id];
          const sensorValue = parseInt(sensorState ? sensorState.state : '0', 10);

          // Find the corresponding bte_entity
          const bteEntityId = entity.entity_id.replace('_qte', '');
          const bte_entity = entities.find((bte) => bte.entity_id === bteEntityId);
          
          const rg_Entity = entity.entity_id.replace('_qte', '_rg');
          const rgState = info.hass.states[rg_Entity];
          const rank = parseInt(rgState ? rgState.state : '0', 10);
          
          if (bte_entity && sensorValue > 0) {
            for (let j = 0; j < sensorValue; j++) {
              const card = {
                type: "custom:mushroom-template-card",
                primary: '',
                secondary: '{{states.' + bte_entity.entity_id + '.state}}',
                icon: '',
                entity: bte_entity,
                icon_color: '',
                fill_container: "true",
                picture: "{% if states." + bte_entity.entity_id + "_robe.state == 'BLANC' %}\n/local/assets/bte_blanc.png\n{% elif states." + bte_entity.entity_id + "_robe.state == 'ROSE'  %}\n/local/assets/bte_rose.png\n{% elif states." +bte_entity.entity_id + "_robe.state == 'ROUGE'  %}\n/local/assets/bte_rouge.png\n{% elif states." + bte_entity.entity_id + "_robe.state == 'EFFERVESCENT'  %}\n/local/assets/bte_bulle.png\n{% else %}\n/local/assets/bte_libre.png\n{% endif %}",
                layout: "vertical",
                multiline_secondary: "true",
              };
              // Check the rank and insert entities into the appropriate horizontal stack
              if (rank === 1) {
                horizontalStack.cards.push(card);
              } else if (rank === 2 && i < 7) {
                // Create nextHorizontalStack if it doesn't exist
                if (!nextHorizontalStack) {
                  nextHorizontalStack = {
                    type: "horizontal-stack",
                    cards: [],
                  };
                }
                // Insert entities into the next horizontal stack
                nextHorizontalStack.cards.push(card);
              }
            };
          }
        }
      });
      // Fill missing cards
      this.fillMissingCards(horizontalStack);
      verticalStack.cards.push(horizontalStack);
      if (nextHorizontalStack) {
        this.fillMissingCards(nextHorizontalStack);
        verticalStack.cards.push(nextHorizontalStack);
      }
    }
      cards.push(verticalStack);
      return {
        cards: cards,
      };
  }
}
customElements.define("ll-strategy-pl-cave", StrategyCaveAVin);