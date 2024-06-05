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
        <h3>Name and surname: ${user.fullName}</h3>
        <h3>Age: ${user.age}</h3>
        <h3>ID: ${user.id}</h3>
        <h3>Home/Residence: ${user.home}</h3>
        <h3>Job: ${user.job}</h3>
        <h3>Phone number: ${user.phoneNumber}</h3>
        <h3>E-Mail: ${user.email}</h3>
      </div>
    `;
    
    App.defaultValues(appComponent);
    this.screen.prepend(appComponent);
    openedApps.push(new Personide(appComponent));
  }
}