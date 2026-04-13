
export enum Direction {
	ALL = '',
	WEST = 'WEST',
	EAST = 'EAST',
	NORTH = 'NORTH',
	SOUTH = 'SOUTH',
	EAST_WEST = 'EAST_WEST',
	NORTH_WEST = 'NORTH_WEST',
	NORTH_EAST = 'NORTH_EAST',
	SOUTH_WEST = 'SOUTH_WEST',
	SOUTH_EAST = 'SOUTH_EAST',
	NORTH_SOUTH = 'NORTH_SOUTH',
}

export enum Bound {
	ALL = "",
	TOP = "TOP",
	LEFT = "LEFT",
	RIGHT = "RIGHT",
	BOTTOM = "BOTTOM",
}

export interface Ceiling {
	top?: number;
	left?: number;
	right?: number;
	bottom?: number;
}