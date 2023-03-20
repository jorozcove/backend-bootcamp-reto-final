import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {

  //User routes
  Route.post("/login", "UsersController.login")

  Route.group(() =>{
    Route.post('/create', 'UsersController.register');
    Route.put('/update/:id_user', 'UsersController.updateUser').middleware(['auth', 'admin'])
    Route.get('/getUsers', 'UsersController.getUsers').middleware(['auth', 'admin'])
    Route.get('/getUser/:id_user', 'UsersController.getUser').middleware('auth')
  }).prefix('user')

  //Role routes
  Route.group(() =>{
    Route.post('/create', 'RolesController.createRole');
    Route.get('/getRoles', 'RolesController.getRoles')
    Route.delete('/deleteRol/:id_role', 'RolesController.deleeRole')
    Route.put('/updateRol/:id_role', 'RolesController.updateRole')
  }).prefix('rol').middleware(['auth', 'admin'])

  //Doc Type routes
  Route.group(() =>{
    Route.post('/create', 'TypesDocumentsController.createTypeDocument');
    Route.get('/getTypesDocuments', 'TypesDocumentsController.getTypesDocuments')
    Route.delete('/deleteTypeDocument/:id_typeDocument', 'TypesDocumentsController.deleteTypeDocument')
    Route.put('/updateTypeDocument/:id_typeDocument', 'TypesDocumentsController.updateTypeDocument')
  }).prefix('typeDocument').middleware(['auth', 'admin'])

  //Question routes
  Route.group(() =>{
    Route.post('/create', 'QuestionsController.createQuestion').middleware('admin');
    Route.get('/getQuestions', 'QuestionsController.getQuestions');
    Route.delete('/deleteQuestion/:id_question', 'QuestionsController.deleteQuestion').middleware('admin');
    Route.put('/updateQuestion/:id_question', 'QuestionsController.updateQuestion').middleware('admin');

    //Answer routes
    Route.get('/getOptions/:id_question', 'AnswersController.listAnswers');
    Route.post('/updateAnswer/:id_answer', 'AnswersController.updateAnswerById').middleware('admin');

  }).prefix('question').middleware('auth')

  //Form routes
  Route.group(() => {
    Route.get('/getQuestions', 'FormsController.getQuestions');
    Route.post('/postQuestions', 'FormsController.postQuestions');
  }).prefix('form').middleware('auth')

}).prefix("api/v1")

