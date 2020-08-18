class DropBoxController{

  constructor(){

    this.buttonSendFileElement = document.querySelector('#btn-send-file');
    this.inputFileElement = document.querySelector('#files');
    this.snackModalElement = document.querySelector('#react-snackbar-root');
    this.progressBarElement = this.snackModalElement.querySelector('.mc-progress-bar-fg');
    this.nameFileElement = this.snackModalElement.querySelector('.filename');
    this.timeLeftElement = this.snackModalElement.querySelector('.timeleft');
    this.initEvents();

  }

  /*QUANDO CLICAR NO BOTÃO, FORÇA O CLICK NO INPUT FILES E ABRA A JANELA
  QUE VAI ANEXAR ARQUIVOS.*/
  initEvents(){
    this.buttonSendFileElement.addEventListener('click', e=>{
      this.inputFileElement.click()
    });
    /*QUANDO FOR SELECIONADO ALGUM ARQUIVO MOSTRE O CHANGE DOS ARQUIVOS*/ 
    this.inputFileElement.addEventListener('change', e=>{
      this.uploadTask(e.target.files);
      this.modalToggleShow();
      //RESET
      this.inputFileElement.value = '';
    })
  }

  // RESULTADO DO UPLOAD
  /* CRIA UMA PROMESA QUE RETORNARÁ QUAIS ARQUIVOS CARREGARAM E QUAIS TIVERAM PROBLEMAS */
  uploadTask(files){
    let promises = [];
    [...files].forEach(file => {
      promises.push(new Promise((resolve, reject)=>{
        let ajax = new XMLHttpRequest();

        ajax.open('POST', '/upload');
        ajax.onload = event=>{
          this.modalToggleShow(false);
          try{
            resolve(JSON.parse(ajax.responseText));
          }catch(e){
            reject(e);
          }
        }
        ajax.onerror = event=>{
          this.modalToggleShow(false);
          reject(event);
        }
        // MOSTRA PROGRESSO DO UPLOAD
        ajax.upload.onprogress = event => {
          this.uploadProgress(event, file);
        }
        let formData = new FormData();
        formData.append('input-file', file);
        
        this.startUploadTime = Date.now();
        ajax.send(formData);
      }));
    });
    return Promise.all(promises)
  }

  //AUMENTA A BARRA DE PROGRESSO COM FORME O UPLOAD SEJA EFETUADO, REGRA DE TRES
  //MOSTRA NOME DO ARQUIVO E ESTIMATIVA DE TEMPO DO UPLOAD 
  uploadProgress(event, file){
    let timePent = Date.now() - this.startUploadTime;
    let loaded = event.loaded;
    let total = event.total;

    let percent = ((loaded / total) * 100);
    let timeLeft =(100 - percent) * timePent / percent;

    this.progressBarElement.style.width = `${percent}%`;
    this.nameFileElement.innerHTML = file.name;
    this.timeLeftElement.innerHTML = this.formatTimeToHuman(timeLeft);
  }

  //FORMATO PARA HORA
  formatTimeToHuman(duration){
    let seconds = parseInt((duration/1000) % 60);
    let minutes= parseInt((duration / (1000*60)) % 60);
    let hours = parseInt((duration / (1000* 60 * 60)) % 24);

    if(hours > 0) {
      return `${hours} horas, ${minutes} minutos e ${seconds} segundos`;
    }
    if(minutes > 0) {
      return `${minutes} minutos e ${seconds} segundos`;
    }
    if(seconds > 0) {
      return `${seconds} segundos`;
    }
    else{
      return 'aguarde...'
    }
  }

  //SE A EXIBIÇÃO FOR VERDADEIRA MOSTRA, FALSO ESCONDE 
  modalToggleShow(show = true){

    this.snackModalElement.style.display = (show) ? 'block': 'none';
  }

}