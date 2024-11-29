$(function () {
  const previousBtn = $("header>button:nth-child(1)");
  const nextBtn = $("header>button:nth-child(2)");

  const setContents = (user, post, todo) => {
    // user
    const infoContent = `
    <h1>${user.firstName} ${user.lastName}</h1>
    <p>age: ${user.age}</p>
    <p>email: ${user.email}</p>
    <p>phone: ${user.phone}</p>
    `;
    $(".info__content").html(infoContent);
    $(".info__image > img").attr("src", user.image);
    $(".posts > h3").html(`${user.firstName}'s Post`);
    $(".todos > h3").html(`${user.firstName}'s To Dos`);
    // post
    if (post.length) {
      let postContent = "";
      post.forEach((data) => {
        postContent = `
          <li class="post-${data.id}">
            <h4 class="js-modal-open" data-id="${data.id}">${data.title}</h4>
            <p>${data.body}</p>
          </li>`;
      });
      $(".posts > ul").html(postContent);
      // modal
    } else {
      $(".posts > ul").html("User has no posts");
    }
    // todo
    if (todo.length) {
      let todoContent = "";
      todo.forEach((data) => {
        todoContent = `
          <li class="todo-${data.id}">
            <p>${data.todo}</p>
          </li>`;
      });
      $(".todos > ul").html(todoContent);
    } else {
      $(".todos > ul").html("User has no todos");
    }
  };

  const getData = (userId) => {
    const userData = {
      url: `https://dummyjson.com/users/${userId}`,
      type: "GET",
      dataType: "json",
    };
    const postData = {
      url: `https://dummyjson.com/users/${userId}/posts`,
      type: "GET",
      dataType: "json",
    };
    const todoData = {
      url: `https://dummyjson.com/users/${userId}/todos`,
      type: "GET",
      dataType: "json",
    };
    $.when($.ajax(userData), $.ajax(postData), $.ajax(todoData)).done(function (user, post, todo) {
      setContents(user[0], post[0].posts, todo[0].todos);
    });
  };
  // Posts by post id (for the modal): [https://dummyjson.com/posts/${postid}]

  const getParams = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const currentId = Number(urlParams.get("id"));
    return currentId && 0 < currentId && currentId <= 30 ? currentId : 1;
  };

  const setParams = (userId) => {
    const urlParams = new URLSearchParams(window.location.search);
    if (Number(urlParams.get("id")) !== userId) {
      urlParams.set("id", userId);
      window.location.search = urlParams;
    }
  };

  const setDefault = () => {
    const userId = getParams();
    setParams(userId);
    getData(userId);
  };

  // add event listener
  // page transition
  previousBtn.on("click", function () {
    const userId = getParams();
    const newId = userId === 1 ? 30 : userId - 1;
    setParams(newId);
  });

  nextBtn.on("click", function () {
    const userId = getParams();
    const newId = userId === 30 ? 1 : userId + 1;
    setParams(newId);
  });

  // accordion
  $(".posts > h3,.todos > h3").on("click", function () {
    const target = $(this).next();
    if (target.css("display") === "block") {
      target.slideUp();
    } else {
      target.slideDown();
    }
  });

  setDefault();
});
