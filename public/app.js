$(document).ready(function() {

    var $formUsername = $('#form-usuario');
    var $formChat = $('#form-chat');
    var $preview = $('#preview');
    var $usuario = $('#usuario')
    var $modalUsername = $('#modal-usuario');

    var ws = new WebSocket(`ws://${location.host}/chat`);

    var send = function(data) {
        ws.send(JSON.stringify(data));
    }

    ws.onopen = () => {
        $modalUsername.modal('show');
    }

// Creamos los json con los diferentes metodos a usar
    ws.onmessage = (event) => {
        var data = JSON.parse(event.data);
        console.log(data)

        if (data.id === 1 && data.result) {
            $modalUsername.modal('hide');
        }

        if (data.id === 1 && data.error) {
            $formUsername.find('input').addClass('is-invalid');
            $formUsername.find('.invalid-feedback').text(data.error.message);
        }

        if (data.method === 'update') {
            $usuario.append(data.params.username);
            console.log("hola", data.params.username);
            $preview.append('<div class="mb-2">' + '<b>' + data.params.username + '</b>:<br/>' + data.params.message + '</div>');
        }
    }

    
    $formUsername.on('submit', function(e) {
        e.preventDefault();
        var username = $(this).find('input').val();
        send({
            id: 1,
            method: 'username',
            params: {
                username: username
            }
        })
    });
// Aqui generamos el Json de envio de mensaje
    $formChat.on('submit', function(e) {
        e.preventDefault();
        send({
            method: 'message',
            params: {
                message: $(this).find('input').val()
            }
        })
    })

});