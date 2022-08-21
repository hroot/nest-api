import { Injectable } from '@nestjs/common';
import { JsonDB } from 'node-json-db';
import { Config } from 'node-json-db/dist/lib/JsonDBConfig';
import { Group } from './group.model';

@Injectable()
export class GroupService {
  private db = new JsonDB(new Config('db', true, true, '/'));
  async getFilesNamesFromGroup(id: number) {
    let answer = {};
    const indexGroup = await this.db.getIndex('/groups/', id, 'id');
    if (indexGroup !== -1) {
      const dataGroup = await this.db.getData(`/groups[${indexGroup}]/devices`);
      let myArray = [];
      for (const item of dataGroup) {
        const index = await this.db.getIndex(`/devices/`, item.id, 'id');
        const data = await this.db.getData(`/devices[${index}]/files/`);
        myArray = myArray.concat(data);
      }
      answer = JSON.stringify(Array.from(new Set(myArray)));
    } else {
      answer = { result: 'Not find group' };
    }
    return answer;
  }
  async addToGroup(id: number, devices_id) {
    let answer = {};
    const indexDevice = await this.db.getIndex('/devices/', devices_id, 'id');
    if (indexDevice !== -1) {
      const indexGroup = await this.db.getIndex('/groups/', id, 'id');
      if (indexGroup === -1) {
        const group = new Group(id);
        group.devices.push({ id: devices_id });
        await this.db.push('/groups[]', group, true);
        answer = group;
      } else {
        const getIndexDeviceInGroup = await this.db.getIndex(
          `/groups/${indexGroup}/devices/`,
          devices_id,
          'id',
        );
        if (getIndexDeviceInGroup === -1) {
          await this.db.push(
            `/groups/${indexGroup}/devices[]`,
            { id: devices_id },
            true,
          );
          answer = await this.db.getData(`/groups[${indexGroup}]`);
        } else {
          answer = { result: 'The device is in the group' };
        }
      }
    } else {
      answer = { result: 'Not find device in devices' };
    }
    return answer;
  }
  async deleteFromGroup(id: number, devices_id: number) {
    let answer = {};
    const indexGroup = await this.db.getIndex('/groups/', id, 'id');
    if (indexGroup !== -1) {
      const indexDevice = await this.db.getIndex(
        `/groups[${indexGroup}]/devices/`,
        devices_id,
        'id',
      );
      if (indexDevice !== -1) {
        await this.db.delete(`/groups[${indexGroup}]/devices[${indexDevice}]`);
        const countDevicesInGroup = await this.db.count(
          `/groups/${indexGroup}/devices`,
        );
        if (countDevicesInGroup === 0) {
          await this.db.delete(`/groups[${indexGroup}]`);
          answer = { result: 'Delete last device in group and delete group' };
        } else {
          answer = await this.db.getData(`/groups/${indexGroup}/`);
        }
      } else {
        answer = { result: 'Not find device in group' };
      }
    } else {
      answer = { result: 'Not find group' };
    }
    return answer;
  }
}
