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

      this.snackModalElement.style.display = 'block';
    })
  }

  // RESULTADO DO UPLOAD
  /* CRIA UMA PROMESA QUE RETORNARÁ QUAIS ARQUIVOS CARREGaram E QUAIS TIVERAM PROBLEMAS */
  uploadTask(files){
    let promises = [];
    [...files].forEach(file => {
      promises.push(new Promise((resolve, reject)=>{
        let ajax = new XMLHttpRequest();

        ajax.open('POST', '/upload');
        ajax.onload = event=>{
          try{
            resolve(JSON.parse(ajax.responseText));
          }catch(e){
            reject(e);
          }
        }
        ajax.onerror = event=>{
          reject(event);
        }
        // MOSTRA PROGRESSO DO UPLOAD
        ajax.upload.onprogress = event => {
          this.uploadProgress(event, file);
          console.log(event);
        }

        let formData = new FormData();
        formData.append('input-file', file);
        
        ajax.send(formData);
      }));
    });

    return Promise.all(promises)
  }

  //AUMENTA A BARRA DE PROGRESSO COM FORME O UPLOAD SEJA EFETUADO, REGRA DE TRES
  uploadProgress(event, file){
    let loaded = event.loaded;
    let total = event.total;

    let percent = ((loaded / total) * 100);

    this.progressBarElement.style.width = `${percent}%`;
  }




}