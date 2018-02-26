
export default class MidiController {
  constructor() {
    this.units = [];
  }

  createUnit(id , name) {
    this.units.push(new ControlUnit(id , name));
  }

  deleteByID(id) {
    for(var i = 0 ; i < this.units.length ; i++) {
      if(this.units[i].id === i) {
        this.units.splice(i , 1);
      }
    }
  }

  get unitList() {
    return this.units;
  }

  getUnitByID(id) {
    for(var unit of this.units) {
      if(unit.id === id) {
        return unit;
      }
    }
  }

  getUnitID(name) {
    for(var unit of this.units) {
      if(unit.name === name) {
        return unit.id;
      }
    }
  }

  getValueByUnitID(id) {
    for(var unit of this.units) {
      if(unit.id === id) {
        return unit.value;
      }
    }
  }

  setValueByUnitID(id , value) {
    for(var unit of this.units) {
      if(unit.id === id) {
        unit.value = value;
      }
    }
  }
}

class ControlUnit {
  constructor(_id , _name) {
    this.unitName = _name;
    this.unitID = _id;
    this.unitValue = 0;
    this.unitChannel = 0;
  }

  set name(_name) {
    this.unitName = _name;
  }

  get name() {
    return this.unitName;
  }

  set id(_id) {
    this.unitID = _id;
  }

  get id() {
    return this.unitID;
  }

  set value(_value) {
    this.unitValue = _value;
  }

  get value() {
    return this.unitValue;
  }

  set channel(_channel) {
    this.unitChannel = _channel;
  }

  get channel() {
    return this.unitChannel;
  }

  get toString() {
    return "ControlUnit: Name = " + this.unitName + " ; ID = " + this.unitID +
           " ; Value = " + this.unitValue + " ; Channel = " + this.unitChannel;
  }
}
