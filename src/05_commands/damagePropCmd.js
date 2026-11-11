//#region 05_commands/damagePropCmd.js /////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////

// Player attacks and projectiles overlap props the same way they hit
// creatures — the prop's hp lives on its sprite's data (props stay
// plain Phaser objects per the entity boundary). At zero it breaks:
// explodePropCmd handles the split/burst.
const damagePropCmd = ({scene, prop, attack}) => {
	const data = prop.getData('prop');
	if (!data || data.hp <= 0) return;      // not destructible
	data.hp -= attack.dmg;
	if (data.hp <= 0) explodePropCmd({scene, prop});
};

//#endregion
