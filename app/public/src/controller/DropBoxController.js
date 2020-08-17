class DropBoxController{

  constructor(){

    this.buttonSendFileElement = document.querySelector('#btn-send-file');
    this.inputFileElement = document.querySelector('#files');
    this.snackModalElement = document.querySelector('#react-snackbar-root');
    
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
        ajax.onload = event =>{
          try{
            resolve(JSON.parse(ajax.responseText));
          }catch(e){
            reject(e);
          }
        }
        ajax.onerror = event=>{
          reject(event);
        }

        let formData = new FormData();
        formData.append('input-file', file)
        ajax.send(formData);
      }));
    });
    
    return Promise.all(promises)
  }




}