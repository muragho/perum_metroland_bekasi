const userService = require('../services/User.service.js');
const { db } = require('../configs/Database.js');

async function doLogout(req, res) {
  const cookie = req.cookies.metroAdmRef;
  if (!cookie) return res.sendStatus(204);
  const user = await userService.getByRefToken(cookie);

  if (!user) return res.sendStatus(204);
  await db.User.update(
    {
      refresh_token: null,
    },
    {
      where: {
        id: user.id,
      },
    }
  );
  res.clearCookie(process.env.COOKIE);
  res.clearCookie("metroAdmAcc");
  res.clearCookie("_csrf");
  res.redirect("/metroland/auth");
};

module.exports = doLogout
