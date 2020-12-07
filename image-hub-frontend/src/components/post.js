import React, { useState } from "react";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import FavoriteIcon from "@material-ui/icons/Favorite";
import Skeleton from "@material-ui/lab/Skeleton";
import { FetchUrl, postData } from './profile';
import { PostLikes } from "./modals";
import { AuthManager } from "../providers/authProvider";
import { Button, Grid, Link } from "@material-ui/core";

//@Todo: A Like számlálóhoz kell csinálni egy modalt, ami megjeleníti a lájkolókat
//@Todo: Az feltöltő nevére húzott egérrel, megjelenik egy mini summary

export default function CreatePost(args) {

  const url = "https://imagehub.azurewebsites.net/api/v2.0/Post/" + args.post.id + "/likes";
  const [likes, setLikes] = useState([]);
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [liked, setLiked] = useState(false);

  if (!isLoaded) {
    FetchUrl(url)
      .then(res => { setLikes(res); })
      .catch(err => setError(err))
      .finally(setIsLoaded(true));
  }
  else {
    AuthManager.getUser().then(user => { setLiked(likes.includes(user.id)) })
  }

  return (
    <Card maxwidth={500} marginbottom={15} key={args.post.Id}>
      <CardHeader
        avatar={
          <Avatar src={args.post.uploader.profilePictureUrl} />
        }
        title={<Link color="inherit" variant="h6"  href={"/Profile?" + args.post.uploader.id}>
              {args.post.uploader.name}     
          </Link>}
      />
      <CardMedia>
        <img height={400} paddingtop="60.0%" src={args.post.pictureUrl}></img>
      </CardMedia>
      

      

      <CardContent>
        <Typography variant="body2" color="textSecondary" component="p">
          Uploaded:{args.post.uploadTime}
        </Typography>
        <Typography variant="subtitle1" color="textPrimary" component="p">
          {args.post.description}
        </Typography>
      </CardContent>

      <CardActions >
        <Grid container direction="row" justify="flex-start" alignItems="center">
          <Grid item>
            <IconButton aria-label="Likes" onClick={() => LikePost(args.post.id, liked, setLiked)}>
              <FavoriteIcon fontSize="large" color={liked ? 'secondary' : 'inherit'} />
            </IconButton>
          </Grid>
          <Grid item>
            <PostLikes likes={likes} numberOfLikes={args.post.like} />
          </Grid>
        </Grid>
        
      </CardActions>

    </Card>
  );
}

function LikePost(id, liked, setLiked) {
  if (id && id.toString().length > 20) {
    if (!liked) {
      var url = "https://imagehub.azurewebsites.net/api/v2.0/Post/" + id + "/like";
    }

    else {
      var url = "https://imagehub.azurewebsites.net/api/v2.0/Post/" + id + "/unlike";
    }

    if (postData(url) === 200) {
      setLiked(!liked);
    }
    else {
      //Error page
    }
  }

};

export function LoadingPost() {
  return (
    <Card marginbottom={15}>
      <CardHeader
        avatar={
          <Skeleton animation="wave" variant="circle" width={40} height={40} />
        }
        action={null}
        title={
          <Skeleton
            animation="wave"
            height={10}
            width="80%"
            style={{ marginbottom: 6 }}
          />
        }
        subheader={<Skeleton animation="wave" height={10} width="40%" />}
      />
      {
        <Skeleton
          animation="wave"
          variant="rect"
          width="100%"
          height={300}
          paddingtop={"100.00%"}
        />
      }

      <CardContent width={500}>
        {
          <React.Fragment>
            <Skeleton
              animation="wave"
              height={10}
              style={{ marginbottom: 6 }}
            />
            <Skeleton animation="wave" height={10} width="80%" />
          </React.Fragment>
        }
      </CardContent>
    </Card>
  );
}
