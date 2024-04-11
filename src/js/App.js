import Ticket from './components/Ticket';
import ErrorPopup from './components/ErrorPopup';

export default class App {
  constructor() {
    this.tickets = [];
    this.port = 8080;
    this.actualTicket;

    this.#addBtnListener();
    this.#submitListener();
    this.#cancelButtonsListener();

    this.#init();
  }

  #addBtnListener() {
    const addBtn = document.querySelector('.field_addBtn');
    addBtn.addEventListener('click', () => {
      const addPopup = document.querySelector('.popup_add');
      addPopup.style.display = 'flex';
    });
  }

  #init() {
    fetch(`http://localhost:${this.port}/?method=allTickets`)
      .then(response => {
        if (response.ok && response.status !== 204) {
          return response.json();
        } else {
          throw new Error('Response is not Ok or status is 204');
        }
      })
      .then(data => {
        this.tickets = data;
      })
      .then(() => {
        if (this.tickets.length > 0) {
          this.#drawTickets();
        }
      })
      .catch(err => {
        console.log(err);
      });
    
  }

  #ticketListener(ticket) {
    const progressBtn = ticket.querySelector('.ticket_progressBtn');
    const editBtn = ticket.querySelector('.ticket_editBtn');
    const deleteBtn = ticket.querySelector('.ticket_deleteBtn');

    ticket.addEventListener('click', (e) => {
      this.actualTicket = ticket;

      const ticketFrame = this.tickets.find(t => t.id === this.actualTicket.id);

      switch (e.target) {
        case progressBtn:
          const body = JSON.stringify({
            status: !ticketFrame.status,
          });
    
          fetch(`http://localhost:${this.port}/?method=updateById&id=${this.actualTicket.id}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json;charset=utf-8'
            },
            body,
          })
            .then(response => {
              if (response.ok && response.status !== 204) {
                return response.json();
              } else {
                throw new Error('Response is not Ok or status is 204');
              }
            })
            .then(data => {
              this.tickets.forEach(t => {
                if (t.id === data.id) {
                  t.status = data.status;
                }
              })
            })
            .then(() => {
              this.actualTicket = undefined;
              if (this.tickets.length > 0) {
                this.#drawTickets();
              }
            })
            .catch(err => {
              console.log(err);
            });
          break;
        case editBtn: 
          const ticketName = ticket.querySelector('.ticket_Name').textContent;

          const editPopup = document.querySelector('.popup_edit');
          editPopup.style.display = 'flex';
    
          fetch(`http://localhost:${this.port}/?method=ticketById&id=${this.actualTicket.id}`)
            .then(response => {
              if (response.ok && response.status !== 204) {
                return response.json();
              } else {
                throw new Error('Response is not Ok or status is 204');
              }
            })
            .then(data => {
              const { description } = data;
              return description;
            })
            .then(description => {
              if (description) {
                editPopup.querySelector('.popup_input').value = ticketName;
                editPopup.querySelector('.popup_textarea').value = description;
              }
            })
            .catch(err => {
              console.log(err);
            });
          break;

        case deleteBtn:
          const deletePopup = document.querySelector('.popup_delete');
          deletePopup.style.display = 'flex';
          break;
        default:
          fetch(`http://localhost:${this.port}/?method=ticketById&id=${this.actualTicket.id}`)
            .then(response => {
              if (response.ok && response.status !== 204) {
                return response.json();
              } else {
                throw new Error('Response is not Ok or status is 204');
              }
            })
            .then(data => {
              const { description } = data;
              return description;
            })
            .then(description => {
              console.log(description);
              const ticketDescription = this.actualTicket.querySelector('.ticket_Description');
              if (ticketDescription.textContent === '') {
                description.forEach(row => {
                  const p = document.createElement('p');
                  p.textContent = row;
                  ticketDescription.append(p);
                });
              } else {
                ticketDescription.textContent = '';
              }
            })
            .catch(err => {
              console.log(err);
            });

        break;
      }

    });

    progressBtn.addEventListener('click', (e) => {
      this.actualTicket = ticket;

      const ticketFrame = this.tickets.find(t => t.id === this.actualTicket.id);

      const body = JSON.stringify({
        status: !ticketFrame.status,
      });

      fetch(`http://localhost:${this.port}/?method=updateById&id=${this.actualTicket.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=utf-8'
        },
        body,
      })
        .then(response => {
          if (response.ok && response.status !== 204) {
            return response.json();
          } else {
            throw new Error('Response is not Ok or status is 204');
          }
        })
        .then(data => {
          this.tickets.forEach(t => {
            if (t.id === data.id) {
              t.status = data.status;
            }
          })
        })
        .then(() => {
          this.actualTicket = undefined;
          if (this.tickets.length > 0) {
            this.#drawTickets();
          }
        })
        .catch(err => {
          console.log(err);
        });
    });

    editBtn.addEventListener('click', (e) => {
      this.actualTicket = ticket;

      const ticketName = ticket.querySelector('.ticket_Name').textContent;

      const editPopup = document.querySelector('.popup_edit');
      editPopup.style.display = 'flex';

      fetch(`http://localhost:${this.port}/?method=ticketById&id=${this.actualTicket.id}`)
        .then(response => {
          if (response.ok && response.status !== 204) {
            return response.json();
          } else {
            throw new Error('Response is not Ok or status is 204');
          }
        })
        .then(data => {
          const { description } = data;
          return description;
        })
        .then(description => {
          if (description) {
            editPopup.querySelector('.popup_input').value = ticketName;
            editPopup.querySelector('.popup_textarea').value = description;
          }
        })
        .catch(err => {
          console.log(err);
        });
    });

    deleteBtn.addEventListener('click', (e) => {
      this.actualTicket = ticket;

      const deletePopup = document.querySelector('.popup_delete');
      deletePopup.style.display = 'flex';
    });
  }

  #drawTickets() {
    document.querySelector('.field_ticketsContainer').innerHTML = '';
    this.tickets.forEach((t) => {
      const ticket = document.createElement('div');
      ticket.classList.add('ticket');
  
      ticket.setAttribute('id', t.id);

      const ticketBody = document.createElement('div');
      ticketBody.classList.add('ticket_body');
  
      const progressBtn = document.createElement('div');
      progressBtn.classList.add('ticket_progressBtn');
      progressBtn.classList.add('ticket_icon');
      progressBtn.classList.add('btn');
      if (t.status) {
        progressBtn.classList.add('ticket_progressBtn-active');
      }
      const nameAndDateContainer = document.createElement('div');
      nameAndDateContainer.classList.add('ticket_nameAndDateContainer');
  
      const ticketName = document.createElement('span');
      ticketName.classList.add('ticket_Name');
      ticketName.textContent = t.name;
  
      const ticketDescription = document.createElement('span');
      ticketDescription.classList.add('ticket_Description');
  
      const ticketCreated = document.createElement('span');
      ticketCreated.classList.add('ticket_created');
      ticketCreated.textContent = t.created;

      nameAndDateContainer.append(ticketName, ticketCreated);
  
      const editBtn = document.createElement('div');
      editBtn.classList.add('ticket_editBtn');
      editBtn.classList.add('ticket_icon');
      editBtn.classList.add('btn');
  
      const deleteBtn = document.createElement('div');
      deleteBtn.classList.add('ticket_deleteBtn');
      deleteBtn.classList.add('ticket_icon');
      deleteBtn.classList.add('btn');

      ticketBody.append(progressBtn, nameAndDateContainer, editBtn, deleteBtn);
  
      ticket.append(ticketBody, ticketDescription);
  
      document.querySelector('.field_ticketsContainer').append(ticket);
      this.#ticketListener(ticket);
    });  
  }

  #submitListener() {
    const field = document.querySelector('.field');
    field.addEventListener('submit', (e) => {
      e.preventDefault();

      if (e.target.closest('.popup').classList.contains('popup_add')) {
        const formData = Array.from(e.target.closest('.form').elements).filter(({ name }) => name);

        const ticket = new Ticket(formData[0].value, formData[1].value);
  
        const body = JSON.stringify(ticket.element);
  
        fetch(`http://localhost:${this.port}/?method=createTicket`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json;charset=utf-8'
          },
          body,
        })
          .then(response => {
            if (response.ok && response.status !== 204) {
              return response.json();
            } else {
              throw new Error('Response is not Ok or status is 204');
            }
          })
          .then(data => {
            if (data.error) {
              throw new Error(data.error);
            } else {
              this.tickets.push(data);
            }
          })
          .then(() => {
            formData[0].value = '';
            formData[1].value = '';
            e.target.closest('.popup').style.display = 'none';
            if (this.tickets.length > 0) {
              this.#drawTickets();
            }
          })
          .catch(err => {
            if (err.message == 'Ticket already exists') {
              const errorPopup = new ErrorPopup(err);

              e.target.closest('.popup').append(errorPopup.element);

              setTimeout(() => {
                errorPopup.element.remove();
              }, 3500);
              
            }
            console.log(err);
          });
      } else if (e.target.closest('.popup').classList.contains('popup_edit')) {
        const status = this.tickets.find(t => t.id === this.actualTicket.id).status;
        const formData = Array.from(e.target.closest('.form').elements).filter(({ name }) => name);

        const body = JSON.stringify({
          name: formData[0].value,
          description: formData[1].value,
        });

        fetch(`http://localhost:${this.port}/?method=updateById&id=${this.actualTicket.id}`, {
          method: 'POST',
          headers: {
            'Content-type': 'application/json;charset=utf-8'
          },
          body,
        })
          .then(response => {
            if (response.ok && response.status !== 204) {
              return response.json();
            } else {
              throw new Error('Response is not Ok or status is 204');
            }
          })
          .then(data => {
            if (data.error) {
              throw new Error(data.error);
            } else {
              this.tickets.forEach(t => {
                if (t.id === data.id) {
                  t.name = data.name;
                  t.description = data.description;
                }
              })
            }
          })
          .then(() => {
            this.actualTicket = undefined;
            e.target.closest('.popup').style.display = 'none';
            if (this.tickets.length > 0) {
              this.#drawTickets();
            }
          })
          .catch(err => {
            if (err.message == 'Ticket already exists') {
              const errorPopup = new ErrorPopup(err);

              e.target.closest('.popup').append(errorPopup.element);

              setTimeout(() => {
                errorPopup.element.remove();
              }, 3500);
              
            }
            console.log(err);
          });
      }
    
    
      if (e.target.closest('.popup').classList.contains('popup_delete')) {
        fetch(`http://localhost:${this.port}/?method=deleteById&id=${this.actualTicket.id}`)
          .then(response => {
            if (response.ok && response.status !== 204) {
              return response.json();
            } else {
              throw new Error('Response is not Ok or status is 204');
            }
          })
          .then(data => {
            this.tickets = data;
          })
          .then(() => {
            this.actualTicket = undefined;
            e.target.closest('.popup').style.display = 'none';
            this.#drawTickets();
          })
          .catch(err => {
            console.log(err);
          });
      }
    });
  }

  #cancelButtonsListener() {
    const cancelButtons = document.querySelectorAll('.popup_cancelBtn');
    [...cancelButtons].forEach((el) => {
      el.addEventListener('click', (e) => {
        e.preventDefault();
        
        e.target.parentNode.parentNode.parentNode.style.display = 'none';
      })
    });
  }

}