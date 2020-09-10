

class BroadcastsController < ApplicationController
  before_action :authenticate_user!

  def show
    render(layout: "broadcast")
  end

  def blank
    render(html: %|<html><body style='background: blue; border: 2px solid red; margin: 0'>
<img src='https://upload.wikimedia.org/wikipedia/commons/c/c4/PM5544_with_non-PAL_signals.png'
style="width: 100%; height: 100%;"/>
</body></html>
|.html_safe)
  end
end