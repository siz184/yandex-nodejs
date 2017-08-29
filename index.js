

function Form(id) {
  this.validate = function(){
  	$('#'+id+' input').removeClass('error');
  	var data = this.getData();
  	var isValid = true;
  	var errorFields = [];
  	if(data.fio){
  		var countWord = data.fio.replace(/\s{2,}/g, ' ').trim().split(' ').length;
  		if(countWord!=3){isValid = false; errorFields.push('fio');}
  	}else{
		isValid = false; errorFields.push('fio');
  	}
  	if(data.phone){
  		var phonePattern = /^\+7\([0-9]+\)\d{3}-\d{2}-\d{2}$/i;
  		if(data.phone.search(phonePattern) == 0){
  			data.phone = data.phone.replace(/\D+/g,"");
  			var summ = 0;
  			for(var i=0; i<data.phone.length; i++){
  				summ = summ + parseInt(data.phone[i]);
  			}
  			if(summ>30){isValid = false; errorFields.push('phone');}
  		}else{isValid = false; errorFields.push('phone');}
  	}else{
  		isValid = false; errorFields.push('phone');
  	}
  	if(data.email){
  		data.email = data.email.toLowerCase();
  		var emailPattern = /^[a-z0-9_-]+@[a-z]+\.[a-z]{2,3}$/i;
  		if(data.email.search(emailPattern) == 0){
  			data.email = data.email.substring(data.email.indexOf('@')+1);
  			var domains = ['ya.ru', 'yandex.ru', 'yandex.ua', 'yandex.by', 'yandex.kz', 'yandex.com'];
  			if(domains.indexOf(data.email) === -1){isValid = false; errorFields.push('email');}
    	}else{
    		isValid = false; errorFields.push('email');
    	}
  	}else{
  		isValid = false; errorFields.push('email');
  	}
  	return {isValid:isValid,errorFields:errorFields};
  };
  this.getData = function(){
  	var fio = $('#'+id+' [name=fio]').val();
  	var phone = $('#'+id+' [name=phone]').val();
  	var email = $('#'+id+' [name=email]').val();
  	return {fio:fio,phone:phone,email:email};
  }
  this.setData = function(data){
  	$('#'+id+' [name=fio]').val(data.fio);
  	$('#'+id+' [name=phone]').val(data.phone);
  	$('#'+id+' [name=email]').val(data.email);
  }
  this.submit = function(){
  	var v = this.validate();
  	if(v.isValid){
  		var url = $('#'+id).attr('action');
      $('#submitButton').attr('disabled','disabled');
      function post(){
    		$.ajax({
    			  type: "post",
      			url: url,
      			success: function(json){
              switch (json['status']) {
                  case 'success':
                    $("#resultContainer").addClass('success').text('Success');
                    break;
                  case 'error':
                    $("#resultContainer").addClass('error').text(json['reason']);
                    break;
                  case 'progress':
                   setTimeout(function(){
                    post()
                   },json['timeout'])
                    break;
                }
      			}
    		});
      }
      post();
  	}else{  		
  		v.errorFields.forEach(function(item) {
  			$('#'+id+' [name='+item+']').addClass('error');
		});
  	}
  }
}

var MyForm = new Form('myForm');
$(function(){
$('#submitButton').click(function(){
	var v = MyForm.submit();
})
})