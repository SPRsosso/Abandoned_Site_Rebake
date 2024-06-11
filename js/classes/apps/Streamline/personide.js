class Personide extends App {
  constructor(window) {
    super();
    
    this.window = window;
  }
  
  static openApp() {
    const appComponent = document.createElement('app-component');
    
    const user = Apartment.activeApartment.pc.user

    appComponent.innerHTML = /*html*/`
      <style>
        #personide {
          width: 100%;
          height: 100%;

          padding: 10px;
        }
      </style>
      <span slot="name">Personide</span>
      <div id="personide">
        <p>Name and surname: ${user.fullName}</p>
        <p>Age: ${user.age}</p>
        <p>ID: ${user.id}</p>
        <p>Home/Residence: ${user.home}</p>
        <p>Job: ${user.job}</p>
        <p>Phone number: ${user.phoneNumber}</p>
        <p>E-Mail: ${user.email}</p>
      </div>
    `;
    
    App.defaultValues(appComponent);
    this.screen.prepend(appComponent);
    openedApps.push(new Personide(appComponent));
  }
}