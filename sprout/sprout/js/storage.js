// storage.js — shared localStorage helpers

const Storage = {
    get(key) {
      try {
        return JSON.parse(localStorage.getItem(key)) || [];
      } catch {
        return [];
      }
    },
  
    set(key, data) {
      localStorage.setItem(key, JSON.stringify(data));
    },
  
    add(key, item) {
      const items = this.get(key);
      item.id = Date.now().toString();
      items.push(item);
      this.set(key, items);
      return item;
    },
  
    remove(key, id) {
      const items = this.get(key).filter(item => item.id !== id);
      this.set(key, items);
    },
  };