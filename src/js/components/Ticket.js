export default class Ticket {
  constructor(name, description) {
    this.#createTicket(name, description);
  }

  #createTicket(name, description) {
    this.name = name;
    this.description = description;
    this.id = null;
    this.status = false;
    this._currentDate = new Date();
    this._day = this._currentDate.getDate() < 10 ? '0' + this._currentDate.getDate() : this._currentDate.getDate();
    this._month = this._currentDate.getMonth() < 10 ? '0' + (this._currentDate.getMonth() + 1) : this._currentDate.getMonth() + 1;
    this._year = this._currentDate.getFullYear();
    this._hour = this._currentDate.getHours() < 10 ? '0' + this._currentDate.getHours() : this._currentDate.getHours();
    this._minute = this._currentDate.getMinutes() < 10 ? '0' + this._currentDate.getMinutes() : this._currentDate.getMinutes();
    this.created = `${this._day}.${this._month}.${this._year} ${this._hour}:${this._minute}`; 
    this._element = {
      name: this.name,
      description: this.description,
      id: this.id,
      status: this.status,
      created: this.created,
    };
  }

  get element() {
    return this._element;
  }
}