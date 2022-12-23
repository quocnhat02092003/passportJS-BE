class HomeController {
  home(req, res, next) {
    res.render('/home')
  }
}

export default new HomeController();
