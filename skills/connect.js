const myModule = require('./common');
const common = myModule.common;  

module.exports = {
ReadOcrImage: function(sourceImageUrl) {
    // Request parameters.
    var params = {
        "language": "unk",
        "detectOrientation ": "true",
    };

    // Perform the REST API call.
    $.ajax({
        url: common.uriBasePreRegion +
             $("#subscriptionRegionSelect").val() +
             common.uriBasePostRegion +
             common.uriBaseOcr +
             "?" +
             $.param(params),

        // Request headers.
        beforeSend: function(jqXHR){
            jqXHR.setRequestHeader("Content-Type","application/json");
            jqXHR.setRequestHeader("Ocp-Apim-Subscription-Key",
                encodeURIComponent($("#subscriptionKeyInput").val()));
        },

        type: "POST",

        // Request body.
        data: '{"url": ' + '"' + sourceImageUrl + '"}',
    })

    .done(function(data) {
        // Show formatted JSON on webpage.
        var json_output = data;
        var words = []
        var region = json_output.regions;
        var i = 0;
        var j = 0;
        var k = 0;
        var space = " ";
        var line = [];
        var word_object;
        var forbidden_words = ["NET", "/", "CHANGE", "SPECIAL", "SUBTOTAL", "CASH", "CREDIT", "DEBIT" ]
        for ( i = 0; i < region.length; i++){
          //Access sub JSON in region
          line = region[i].lines;

          for (j = 0; j < line.length; j++){
            //Access each word in "line" attribute in JSON
            word = line[j].words;

            var coordinates = line[j].boundingBox.split(",");
            word_object = {
              name : "",
              value : null,
              x : parseInt(coordinates[0], 10),
              y : parseInt(coordinates[1], 10)
            }


            for (k = 0; k < word.length; k++){
              //Access each "text" in JSON
              text = word[k].text;
              if(k > 0 && !text.includes(".")){
                text = space.concat(text);
              }
              word_object.name = word_object.name.concat(text);
            }

            var temp = true;


            if(!word_object.name.includes("NET") && !word_object.name.includes("/") && !word_object.name.includes("CHANGE") && !word_object.name.includes("SPECIAL") && !word_object.name.includes("SUBTOTAL") && !word_object.name.includes("CASH") && !word_object.name.includes("TOTAL")){
              words.push(word_object);
            }

            //for(forbidden_word in forbidden_words){
            //  if(word_object.name.includes(forbidden_word)){
            //    temp = false
            //  }
            //}
            //if(temp){
            //  words.push(word_object);
            //}
          }
        }

        words = pair_name_and_value(words);
        return words;
    })

    .fail(function(jqXHR, textStatus, errorThrown) {
        // Put the JSON description into the text area.
        responseTextArea.val(JSON.stringify(jqXHR, null, 2));

        // Display error message.
        var errorString = (errorThrown === "") ? "Error. " : errorThrown + " (" + jqXHR.status + "): ";
        errorString += (jqXHR.responseText === "") ? "" : (jQuery.parseJSON(jqXHR.responseText).message) ?
            jQuery.parseJSON(jqXHR.responseText).message : jQuery.parseJSON(jqXHR.responseText).error.message;
        alert(errorString);
    });
}
}


function pair_name_and_value(items){
  var names = [];
  var values = [];
  var i, j = 0;

  //Split into different categories
  for(i = 0; i < items.length; i++){
    var check = parseFloat(items[i].name);
    console.log(check);
    if((items[i].name.includes("$") || items[i].name.includes(".")) && check != NaN){
      while(items[i].name.includes("o") || items[i].name.includes("O")){
        items[i].name = items[i].name.replace("o", "0");
        items[i].name = items[i].name.replace("O", "0");
      }
      values.push(items[i]);
    } else {
      names.push(items[i]);
    }
  }

  //console.log(JSON.stringify(names, null, 2));
  //console.log(JSON.stringify(values, null, 2));

  //Pair values and name based on y values
  for(i = 0; i < names.length; i++){
    j = 0;
    while(names[i].value == null && j < values.length){
      if(values[j].y <= (names[i].y + 14) && values[j].y >= (names[i].y - 13)){
              names[i].value = values[j].name;
          }
      j++;
    }
  }

  names = add_value_onto_name(names);
  console.log(JSON.stringify(names, null, 2))
  return names;

}

function add_value_onto_name(list){
  var i = 0;
  for(i = 0; i < list.length; i++){
    object = list[i];
    object.name = object.name.concat(" - " + object.value);
    if(object.value != null && object.value.includes("$")){
      object.value = object.value.slice(1,object.value.length)
      console.log(object.value);
    }
    list[i] = object;
  }
  console.log(JSON.stringify(list, null, 2))

  list = remove_bad_items(list);

  return list;
}

function remove_bad_items(list){
  var i = 0;
  for( i = 0; i < list.length; i++){
    var c = parseFloat(list[i].value);
    if(list[i].value == null && isNaN(c)){
      console.log("REMOVE: " + c)
      list.splice(i, 1)
      i--;
    }
  }
  return list;
}
