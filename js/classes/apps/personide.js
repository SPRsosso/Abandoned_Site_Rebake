class Personide extends App {
  constructor(window) {
    super();
    
    this.window = window;
  }
  
  static openApp() {
    const appComponent = document.createElement('app-component');
    
    appComponent.innerHTML = `
      <span slot="name">Personide</span>
    `;
    
    App.defaultValues(appComponent);
    this.screen.prepend(appComponent);
    openedApps.push(new Personide(appComponent));
  }
}