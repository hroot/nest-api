export class Group {
  id: number;

  devices: Array<any>;

  constructor(id?: number) {
    this.id = id;
    this.devices = [];
  }
}
