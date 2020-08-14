const fs = require('fs');
const superagent = require('superagent'); // for http requests

/*
    Problem: we can see that it is easy to nest a lot of callbacks.
    This problem is called "Callback Hell".
*/

// fs.readFile(`${__dirname}/dog.txt`, (err, data) => {
//   if (err) console.log(err);

//   superagent
//     .get(`https://dog.ceo/api/breed/${data}/images/random`)
//     .end((err, res) => {
//       if (err) return console.log(err.message);
//       console.log(res.body);
//       fs.writeFile('dog-img.txt', res.body.message, (err) => {
//         if (err) return console.log(err.message);
//         console.log('Random dog image saved to file');
//       });
//     });
// });

/* Solution: Promises */

const readFilePro = (fileName) => {
  return new Promise((resolve, reject) => {
    fs.readFile(fileName, (err, data) => {
      if (err) reject('Could not read the file 🚫');
      resolve(data);
    });
  });
};

const writeFilePro = (file, data) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(file, data, (err) => {
      if (err) reject('Could not write the file 🚫');
      resolve('success');
    });
  });
};

// readFilePro(`${__dirname}/dog.txt`)
//   .then((data) => {
//     return superagent.get(`https://dog.ceo/api/breed/${data}/images/random`);
//   })
//   .then((res) => {
//     console.log(res.body.message);
//     return writeFilePro('dog-img.txt', res.body.message);
//   })
//   .then((res) => {
//     console.log(res);
//   })
//   .catch((err) => {
//     console.log('ERROR', err);
//   });

/* Async & Await */

const getDogPic = async () => {
  try {
    const data = await readFilePro(`${__dirname}/dog.txt`);
    console.log(`Breed: ${data}`);

    const res = await superagent.get(
      `https://dog.ceo/api/breed/${data}/images/random`
    );
    console.log(res.body.message);

    await writeFilePro('dog-img.txt', res.body.message);
    console.log('Random dog image saved');
  } catch (err) {
    console.log(err);
    throw err;
  }

  return '2: READY!';
};

// console.log('1: Will get dog pics!');
// getDogPic()
//   .then((x) => {
//     console.log(x);
//     console.log('3: Done!');
//   })
//   .catch((err) => {
//     console.log('3: Rejected!');
//   });

/* An other pattern: IIFE, Immediately Invoked Function Expression */

(async () => {
  try {
    console.log('1: Will get dog pics!');
    const data = await getDogPic();
    console.log(data);
    console.log('3: Done!');
  } catch (err) {}
})();

// Wait for multiple Promises simultaneously
const getDogPicMultiple = async () => {
  try {
    const data = await readFilePro(`${__dirname}/dog.txt`);

    const res1Pro = superagent.get(
      `https://dog.ceo/api/breed/${data}/images/random`
    );

    const res2Pro = superagent.get(
      `https://dog.ceo/api/breed/${data}/images/random`
    );

    const res3Pro = superagent.get(
      `https://dog.ceo/api/breed/${data}/images/random`
    );

    const all = await Promise.all([res1Pro, res2Pro, res3Pro]);
    const imgs = all.map((el) => el.body.message);

    await writeFilePro('dog-img.txt', imgs.join('\n'));
  } catch (err) {
    console.log(err);
    throw err;
  }
};

getDogPicMultiple();
