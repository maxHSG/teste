document.addEventListener("DOMContentLoaded", () => {
	const html = `<form action="#" data-planweb-customers-form-add="">
	<div class="row">
		<div class="form-group col-6">
			<label>Nome</label> 
			<input required class="form-control" name="name" placeholder="Seu nome ou da Empresa" required="" type="text" />
		</div>

		<div class="form-group col-6">
			<label>E-mail</label> 
			<input required autocomplete="false" class="form-control" name="email" placeholder="Seu e-mail" required="" type="email" />
			<small id="emailHelp" class="form-text text-muted">Coloque o seu meu melhor e-mail, pois será acessado com ele</small>
		</div>
	</div>

	<div class="row">
		<div class="form-group col-6">
			<label>Senha</label> 
			<input required autocomplete="false" class="form-control" name="password" placeholder="Senha" required="" type="password" />
			<small id="passwordHelp" class="form-text text-muted">Cadastre uma senha</small>
		</div>

		<div class="form-group col-6">
			<label>Confirme a Senha</label> 
			<input required autocomplete="false" class="form-control" name="password2" placeholder="Confirme a Senha" required="" type="password" /> 
			<small id="password2Help" class="form-text text-muted">Digite novamente a senha</small>
		</div>
	</div>

	<div class="row">
		<div class="form-group col-md-2">
			<label>Cep</label> 
			<input autocomplete="false" maxlength="9" class="form-control" name="zipcode" placeholder="CEP" type="text" />
		</div>

		<div class="form-group col-md-4">
			<label>Rua</label> 
			<input autocomplete="false" class="form-control" name="address" placeholder="Endereço" type="text" /> 
		</div>

		<div class="form-group col-md-4">
			<label>Bairro</label> 
			<input autocomplete="false" class="form-control" name="locality" placeholder="Bairro" type="text" />
		</div>

		<div class="form-group col-md-2">
			<label>Numero</label> 
			<input autocomplete="false" class="form-control" name="number" placeholder="Número" type="text" /> 
		</div>
	</div>

	<div class="row">
	

		<div class="form-group col-md-6">
			<label>Estado</label> 
			<select autocomplete="false" class="form-control" name="province" placeholder="UF">
				<option value="AC">Acre</option>
				<option value="AL">Alagoas</option>
				<option value="AP">Amapá</option>
				<option value="AM">Amazonas</option>
				<option value="BA">Bahia</option>
				<option value="CE">Ceará</option>
				<option value="DF">Distrito Federal</option>
				<option value="ES">Espírito Santo</option>
				<option value="GO">Goiás</option>
				<option value="MA">Maranhão</option>
				<option value="MT">Mato Grosso</option>
				<option value="MS">Mato Grosso do Sul</option>
				<option value="MG">Minas Gerais</option>
				<option value="PA">Pará</option>
				<option value="PB">Paraíba</option>
				<option value="PR">Paraná</option>
				<option value="PE">Pernambuco</option>
				<option value="PI">Piauí</option>
				<option value="RJ">Rio de Janeiro</option>
				<option value="RN">Rio Grande do Norte</option>
				<option value="RS">Rio Grande do Sul</option>
				<option value="RO">Rondônia</option>
				<option value="RR">Roraima</option>
				<option value="SC">Santa Catarina</option>
				<option value="SP">São Paulo</option>
				<option value="SE">Sergipe</option>
				<option value="TO">Tocantins</option>
			</select>		
		</div>
		<div class="form-group col-md-6">
			<label>Cidade</label> 
			<input autocomplete="false" class="form-control" name="city" placeholder="Cidade" type="text" />
		</div>
	</div>

	<div class="row">
		<div class="form-group col-md-6">
			<label>Celular</label> 
			<input autocomplete="false" class="form-control" maxlength="15" name="phone" placeholder="Celular" type="text" /> 
		</div>
	</div>

	<div>
		<button type="submit" class="btn form-btn btn-primary">Enviar</button>
	</div>
</form>`;

	const findNodeByContent = (text, root = document.body) => {
		const treeWalker = document.createTreeWalker(
			root,
			NodeFilter.SHOW_TEXT
		);

		const nodeList = [];

		while (treeWalker.nextNode()) {
			const node = treeWalker.currentNode;

			if (
				node.nodeType === Node.TEXT_NODE &&
				node.textContent.includes(text)
			) {
				nodeList.push(node.parentNode);
			}
		}

		return nodeList;
	};

	const [container] = findNodeByContent("[form-planweb]");

	container.innerHTML = html;

	const form = document.querySelector(
		`form[data-planweb-customers-form-add]`
	);

	const clearForm = () => {
		for (const element of [...form.elements]) {
			element.value = "";
		}
	};

	const zipcodeFormElement = document.querySelector("[name='zipcode']");

	zipcodeFormElement.addEventListener("blur", async (e) => {
		try {
			const cep = e.currentTarget.value.replace(/[^0-9]/g, "");

			await fetch(`https://viacep.com.br/ws/${cep}/json/`)
				.then((e) => e.json())
				.then((address) => {
					document.querySelector(`[name='city']`).value =
						address.localidade || "";
					document.querySelector(`[name='locality']`).value =
						address.bairro || "";
					document.querySelector(`[name='province']`).value =
						address.uf || "";
					document.querySelector(`[name='address']`).value =
						address.logradouro || "";
				});
		} catch (error) {}
	});

	document
		.querySelector("[name='password']")
		.addEventListener("keyup", (e) => {
			e.currentTarget.setCustomValidity(``);
		});

	document.querySelector("[name='phone']").addEventListener("blur", (e) => {
		e.currentTarget.value = e.currentTarget.value.replace(
			/(\d{2})(\d{4,5})(\d{4})/,
			"($1) $2-$3"
		);
	});

	document.querySelector("[name='zipcode']").addEventListener("blur", (e) => {
		e.currentTarget.value = e.currentTarget.value.replace(
			/(\d{5})(\d{3})/,
			"$1-$2"
		);
	});

	form.addEventListener("submit", async (e) => {
		e.preventDefault();

		try {
			const password = form.elements.password;
			const password_confirmation = form.elements.password2;

			if (password.value !== password_confirmation.value) {
				password.setCustomValidity(
					`A senha deve ser a mesma que confirmação`
				);

				form.reportValidity();
				return;
			}

			const data = [...form.elements]
				.filter((item) => item.value)
				.reduce((acc, item) => {
					acc[item.name] = item.value;
					return acc;
				}, {});

			data.zipcode = data.zipcode.replace(/[^0-9]/g, "");

			data.phone = data.phone.replace(/[^0-9]/g, "");

			await fetch(`https://nuvemshop.planweb.com.br/customers/save`, {
				body: JSON.stringify({
					...data,
					store_id: LS.store.id,
				}),
				method: "POST",
			}).then((e) => e.json());

			alert(
				"Cadastro realizado! Aguarde o e-mail de confirmação do seu cadastro!"
			);

			clearForm();
		} catch (error) {
			console.log("error", error);
			alert(
				"Aconteceu um erro inesperado. Por favor, entre em contato conosco"
			);
		}
	});
});
