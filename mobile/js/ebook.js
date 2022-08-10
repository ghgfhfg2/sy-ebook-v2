class Ebook {
  constructor(div,option){
    this.div = document.querySelector(div);
    this.container = this.div.querySelector('.ebook__container');
    this.scrollBox = this.div.querySelector('.ebook_scroll_box');
    this.scroll = this.div.querySelector('.ebook__scroll');
    this.imgList = this.div.querySelector('.ebook__img-list');    
    this.list = this.imgList.querySelectorAll('li');
    this.length = this.list.length;
    this.page = 1;
    this.pageSetIdx;
    this.pageSetTxt = this.div.querySelector('.ebook__page-txt');
    this.pageSetPrev = this.div.querySelector('.ebook__page-move-btn.prev');
    this.pageSetNext = this.div.querySelector('.ebook__page-move-btn.next');
    this.pageInput = this.div.querySelector(option.currentPage),
    this.totalPage = this.div.querySelector('.ebook__page-total'),
    this.btnMove = this.div.querySelector('.ebook__btn-page-move'),
    this.pageShow = option.pageShow ? option.pageShow : 2;
    this.prev = this.div.querySelector(option.prev);
    this.next = this.div.querySelector(option.next);
    this.breakPoints = option.breakPoints;
    this.zoom = 1;
    this.zoomMode = false;
    this.zoomRange = this.div.querySelector('.ebook__scale-zoom-range');
    this.zoomIn = this.div.querySelector('.ebook__scale-zoom-in');
    this.zoomOut = this.div.querySelector('.ebook__scale-zoom-out');
    this.zoomTxt = this.div.querySelectorAll('.ebook__scale-txt span');
    this.pageSingle = this.div.querySelector('.ebook__bottom_control_page.page_1');
    this.pageDouble = this.div.querySelector('.ebook__bottom_control_page.page_2');
    this.btnShowTotal = this.div.querySelector('.ebook__bottom_control_page.total');
    this.btnShowBasic = this.div.querySelector('.ebook__bottom_control_page.basic');
    this.pageListUl = this.div.querySelector('.ebook__page-move-list');
    this.pageList = {};
    this.miniMap = this.div.querySelector('.ebook__mini_map');
    this.dragBox = this.div.querySelector('.ebook__mini_map_drag_box');
  }
  init(){
    this.prev.addEventListener('click',()=>{
      this.toPrev()
    })
    this.next.addEventListener('click',()=>{
      this.toNext()
    })
    if(this.btnMove){
      this.btnMove.addEventListener('click',()=>{
        this.toPage()
      })
    }
    if(this.breakPoints){
      let winWidth = window.innerWidth;
      let size = Object.keys(this.breakPoints).sort((a,b)=>b-a);
      let curSize = size.filter(el=>el >= winWidth);
      curSize = curSize.length > 0 ? Math.min.apply(null,curSize) : null;
      if(curSize){
        let option_ = this.breakPoints[curSize];
        for(let key in option_){
          this[key] = option_[key]
        }
      }      
    }
    this.zoomIn.addEventListener('click',()=>{
      this.imgZoomIn();
    });
    this.zoomOut.addEventListener('click',()=>{
      this.imgZoomOut();
    });
    this.pageSetPrev.addEventListener('click',()=>{
      this.onPageSetPrev();
    })
    this.pageSetNext.addEventListener('click',()=>{
      this.onPageSetNext();
    })
    this.pageSingle.addEventListener('click',()=>{
      this.pageShowSingle();
    });
    this.pageDouble.addEventListener('click',()=>{
      this.pageShowDouble();
    });
    this.btnShowTotal.addEventListener('click',()=>{
      this.pageShowTotal();
    });
    this.btnShowBasic.addEventListener('click',()=>{
      this.pageShowBasic();
    })


    let page_one = [];
    let page_two = [];
    let one_set = [];
    let two_set = [];
    let temp = [];
    for(let i=1; i<=this.length; i++){
      one_set.push(i)
      if(one_set.length === 5){
        page_one.push(one_set)
        one_set = [];
      }else if(i === this.length){
        page_one.push(one_set)
      }

      if(i===1){
        two_set.push([i])
      }else{        
        temp.push(i)
        if(temp.length === 2){
          two_set.push(temp);
          temp = [];
        }else if(temp.length === 1 && i === this.length){
          two_set.push(temp);
          temp = [];
        }
        if(two_set.length === 5){
          page_two.push(two_set);
          two_set = [];
        }else if(i === this.length){
          page_two.push(two_set)
        }
      }
    }
    this.pageList.one = page_one;
    this.pageList.two = page_two;    
    this.pageSet();
  }
  pageShowTotal(){
    this.div.classList.add('total');
  }
  pageShowBasic(){
    this.div.classList.remove('total');
  }

  pageShowSingle(){
    this.pageShow = 1;
    this.pageSet();
  }
  pageShowDouble(){
    this.pageShow = 2;
    if(this.page > 1 && this.page % 2){
      this.page--;
    }
    this.pageSet();
  }

  pageListClose(){
    let winWidth = window.innerWidth;
    if(winWidth < 1024){
      let list = this.div.querySelector('.ebook__page-list');
      if(!list.classList.contains('on')){
        list.classList.add('on')
      }
    }
  }

  pageListToggleOn(){
    this.div.querySelector('.ebook__page-list').classList.toggle('on');
    this.scroll.classList.toggle('on');
  }

  pageSet(){
    if(this.pageShow == 1){
      this.div.classList.add('single')
      this.div.classList.remove('double')
    }else{
      this.div.classList.add('double')
      this.div.classList.remove('single')
    }
    if(this.page == 1){
      this.imgList.classList.add('first');     
    }else{
      this.imgList.classList.remove('first')
    }    
    if(this.page == this.length){
      this.imgList.classList.add('last');
    }else{
      this.imgList.classList.remove('last')
    }  
    this.list.forEach(el=>{
      el.classList.remove('active')
    })    
    if(this.pageShow === 1){      
      this.list[this.page-1].classList.add('active')
    }
    if(this.pageShow === 2){      
      if(this.page == 1){
        this.list[0].classList.add('active');
      }else{
        this.list[this.page-1].classList.add('active');
        this.list[this.page] && this.list[this.page].classList.add('active','right');
      }
    }
    if(this.pageInput){
      this.totalPage.innerText = this.length
      this.pageInput.value = this.page
    }
    if(this.page == 1){
      this.div.querySelector('.ebook__prev').classList.remove('on')
      this.div.querySelector('.ebook__next').classList.add('on')
    }else if(this.page == this.length){
      this.div.querySelector('.ebook__prev').classList.add('on')
      this.div.querySelector('.ebook__next').classList.remove('on')
    }else{
      this.div.querySelector('.ebook__prev').classList.add('on')
      this.div.querySelector('.ebook__next').classList.add('on')
    }    
    this.onPageList();

    
  }
  // btnSet(){
  //   const activeImg = this.imgList.querySelectorAll('.active img');
  //   activeImg[0].offsetLeft
  //   const prevX = activeImg[0].getBoundingClientRect().left;
  //   const nextX = activeImg[activeImg.length - 1].getBoundingClientRect().right;
  //   this.div.querySelector('.ebook__prev').style.left = prevX-70+'px'
  //   this.div.querySelector('.ebook__next').style.left = nextX+20+'px'
  // }
  toPrev(){
    if(this.page > 1){
      if(this.page == 2){
        this.page = 1
      }else{
        this.page -= this.pageShow;
      }
      this.pageSet()
    }else{
      alert('첫번째 페이지 입니다.')
    }
  }
  toNext(){    
    
    if(this.page+this.pageShow <= this.length){
      if(this.page == 1){
        this.page++;
      }else{
        this.page += this.pageShow;
      }
      this.pageSet()
    }else{
      alert('마지막 페이지 입니다.')
    }
  }

  imgZoomIn(){
    if(parseInt(this.zoom) >= 1){
      this.imgZoomMax()
    }else{
      this.imgZoomDefault()
    }
  }
  imgZoomOut(){
    if(this.zoom > 1){
      this.imgZoomDefault()
    }else{
      this.imgZoomMin()
    }
  }
  imgZoomMax(){
    if(this.zoomMode) return;
    this.zoomMode = true;
    this.zoom = 1.8;
    this.imgList.style = `transform:scale(1)`;
    this.scroll.style = `--scale:${this.zoom}`;
    this.scrollBox.classList.add('zoom-mode');
    let scrX = this.scrollBox.scrollWidth/4;
    let scrY = this.scrollBox.scrollHeight/4;
    setTimeout(()=>{
      this.scrollBox.scrollBy(scrX,scrY)
    },10)
  }
  imgZoomDefault(){
    this.scrollBox.classList.remove('zoom-mode');
    this.zoomMode = false;
    this.zoom = 1;
    this.scroll.style = `--scale:${this.zoom}`;
    this.imgList.style = `transform:scale(${this.zoom})`;
  }
  imgZoomMin(){
    this.scrollBox.classList.remove('zoom-mode');
    this.zoomMode = false;
    this.zoom = 0.4;
    this.imgList.style = `transform:scale(${this.zoom})`;
  }
  imgZoomMode(){
    if(this.zoomMode){
      this.imgZoomDefault()
    }else{
      this.imgZoomMax()
    }
  }

  onPageList(){
    this.pageSetTxt.querySelector('.total').innerHTML = this.length
    if(this.pageShow === 1){
      this.onPageSetOne()      
    }else{
      this.onPageSetTwo() 
    }
    
  }
  onPageSetOne(type){
    let pageIdx;
    let curPage;
    let pageHtml = '';  
    let realIdx;
    this.pageList.one.forEach((el,idx)=>{
      if(el.indexOf(this.page) > -1){
        curPage = el.indexOf(this.page);
        pageIdx = idx
        realIdx = idx
      }
    })
    if(type === 'prev'){
      if(pageIdx > 0) pageIdx--;
    }else if(type === 'next'){
      if(pageIdx < this.pageList.one.length-1) pageIdx++;
    }
    this.pageSetIdx = pageIdx;
    this.pageList.one[pageIdx].forEach((el,idx)=>{
      if(curPage === idx && realIdx === pageIdx){
        this.pageSetTxt.querySelector('.cur').innerHTML = el
        pageHtml += `<li onclick='toPage(${el})' class='on'>${el}</li>`
      }else{
        pageHtml += `<li onclick='toPage(${el})'>${el}</li>`
      }
    })  
    this.pageListUl.innerHTML = pageHtml;   
  }
  onPageSetTwo(type){
    let pageIdx;
    let curPage;
    let pageHtml = '';
    let realIdx;
    this.pageList.two.forEach((el,idx)=>{
      el.forEach((e,idx2)=>{
        if(e.indexOf(this.page) > -1){
          curPage = idx2;
          pageIdx = idx
          realIdx = idx
        }
      })
    })
    if(type === 'prev'){
      if(pageIdx > 0) pageIdx--;
    }else if(type === 'next'){
      if(pageIdx < this.pageList.two.length-1) pageIdx++;
    }
    this.pageSetIdx = pageIdx;
    this.pageList.two[pageIdx].forEach((el,idx)=>{
      let list = el.join(' - ');
      if(curPage === idx && realIdx === pageIdx){
        this.pageSetTxt.querySelector('.cur').innerHTML = list.split(' - ').join('-')
        pageHtml += `<li onclick='toPage(${list.split(' - ')[0]})' class='on'>${list}</li>`
      }else{
        pageHtml += `<li onclick='toPage(${list.split(' - ')[0]})'>${list}</li>`
      }
    })
    this.pageListUl.innerHTML = pageHtml;  
  }

  onPageSetPrev(){
    if(this.pageShow === 1){
      this.onPageSetOne('prev')      
    }else{
      this.onPageSetTwo('prev') 
    }
  }
  onPageSetNext(){
    if(this.pageShow === 1){
      this.onPageSetOne('next')      
    }else{
      this.onPageSetTwo('next') 
    }
  }





}