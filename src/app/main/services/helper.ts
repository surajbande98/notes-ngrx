

export class Helper {

    constructor() { }

    static findItem(list, id) {
        return list.findIndex(item => (item.id == id));

    }

    static updateObject(oldObject, updatedProps) {
        return {
            ...oldObject,
            ...updatedProps
        };
    }

}