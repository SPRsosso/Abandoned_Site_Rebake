class BrowserUser {
    constructor(id, nickname, password, name, surname, age, description = null, residence = null) {
        this.id = id;
        this.nickname = nickname;
        this.password = password;
        this.name = name;
        this.surname = surname;
        this.age = age;
        this.description = description;
        this.residence = residence;
    }

    setNickname(nickname) {
        this.nickname = nickname;
    }

    setPassword(password) {
        this.password = password;
    }

    setName(name) {
        this.name = name;
    }

    setSurname(surname) {
        this.surname = surname;
    }

    setAge(age) {
        this.age = age;
    }

    setDescription(description) {
        this.description = description;
    }

    setResidence(residence) {
        this.residence = residence;
    }
}